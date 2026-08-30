import base64
import uuid
from typing import Annotated

from fastapi import Depends, HTTPException, Response, UploadFile
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.requests import Request

from app.core.config import settings
from app.core.security import Auth
from app.modules.auth.exceptions.auth_exception import (
    InvalidEmailOrPassword,
    InvalidOrExpiredOtp,
    InvalidOrExpiredToken,
    InvalidSession,
    ManyAttemptsError,
    MissingDeviceID,
    MissingKey,
    MissingToken,
    UserAlreadyExists,
    UserDoesnotExist,
    UserNotAuthenticated,
)
from app.modules.auth.schemas.user_schema import (
    ChangePasswordResetSchema,
    ForgetPassSchema,
    OtpVerifySchema,
    RegisterSuccessResponseSchema,
    UserLogin,
    UserRegiser,
)
from app.modules.cart.cart_services import CartService
from app.modules.cart.factories import get_cart_service
from app.repos.session_repo import SessionRepo
from app.repos.user_repo import UserRepo
from app.schemas.common import SuccessResponse
from app.tasks.auth_task import upload_user_image
from app.tasks.email_task import send_otp, send_reset_otp


class AuthService:
    def __init__(
        self,
        repo: UserRepo,
        session_repo: SessionRepo,
        cart_service: Annotated[CartService, Depends(get_cart_service)],
    ):
        self.repo = repo
        self.session_repo = session_repo
        self.cart_service = cart_service

        # Auth services

    async def register_user(
        self, data: UserRegiser, request: Request, image: UploadFile | None
    ):
        if data.email:
            user = await self.repo.get_user_by_field("email", data.email)
            if user:
                raise UserAlreadyExists
        else:
            user = await self.repo.get_user_by_field("phone_no", data.mobile_number)
            if user:
                raise UserAlreadyExists
        create_data = {
            "email": data.email or None,
            "password": Auth().hash_content(data.password_1),
            "phone_no": data.mobile_number or None,
            "first_name": data.first_name,
            "last_name": data.last_name,
        }
        new_user = await self.repo.create_user(create_data)
        profile_data = {
            "user_id": new_user.id,
            "full_name": f"{data.first_name} {data.last_name}",
        }
        await self.repo.create_profile(profile_data)
        if image and image.file:
            content = await image.read()
            image_string = base64.b64encode(content).decode("utf-8")
            upload_user_image.delay(image_string, str(new_user.id))
        # Generate the otp
        otp = Auth().generate_otp()
        await Auth().set_otp_key(otp, str(new_user.id))
        source = "email" if data.email else "phone_no"
        source_value = data.email if data.email else data.mobile_number
        send_otp.delay(otp, source, [source_value], new_user.first_name)
        await Auth().set_resend_key(str(new_user.id))
        return SuccessResponse(
            message="User created.Please verify your email",
            data={
                "field_name": source,
                "field_value": source_value,
                "user_id": str(new_user.id),
            },
        )

    async def login_user(self, data: UserLogin, request: Request):
        is_locked, time = await Auth().is_locked(
            data.mobile_number if data.mobile_number else data.email
        )
        field_name = "phone_no" if data.mobile_number else "email"
        value = data.mobile_number if data.mobile_number else data.email
        if is_locked:
            raise ManyAttemptsError(
                message=f"Too many attempts please try again after {time} {'minutes' if time > 1 else 'minute'}"
            )
        user = await self.repo.get_user_by_field(field_name, value)
        if not user:
            await Auth().increase_attempt(value)
            raise InvalidEmailOrPassword
        # Check the provider
        if user.provider and user.provider_id:
            raise HTTPException(
                status_code=400, detail="This account has different provider"
            )
            # Check the password
        if not Auth().verify_hash(data.password, user.password):
            await Auth().increase_attempt(value)
            raise InvalidEmailOrPassword

        if not user.is_authenticated:
            login_otp = Auth().generate_otp()
            source = "email" if data.email else "phone_no"
            source_value = data.email if data.email else data.mobile_number
            exist_otp_already = await Auth().exists_otp_key(str(user.id))
            if exist_otp_already:
                raise UserNotAuthenticated(
                    details={
                        "field_name": source,
                        "field_value": source_value,
                        "user_id": str(user.id),
                    }
                )
            send_otp.delay(login_otp, source, [source_value], user.first_name)
            await Auth().set_otp_key(login_otp, str(user.id))
            await Auth().set_resend_key(str(user.id))
            raise UserNotAuthenticated(
                details={
                    "field_name": source,
                    "field_value": source_value,
                    "user_id": str(user.id),
                }
            )

        jti = uuid.uuid4()
        device_id = request.headers.get("X-Device-ID")
        if not device_id:
            # ----------For swagger-----------
            device_id = str(uuid.uuid4())

            # ------------Normally--------------------
            # raise HTTPException(status_code=400, detail="Missing device ID")

        # Check if the session exist or not
        session = await self.session_repo.get_session_by_device_id_user_id(
            device_id, user.id
        )
        if session:
            await self.session_repo.put_jti_into_session(jti, session)
        else:
            session = await self.session_repo.create_session(
                request,
                device_id,
                user.id,
                jti,  # type: ignore
            )  # type:ignore
        token_data = {
            "user_id": str(user.id),
            "jti": str(jti),
            "session_id": str(session.id),
        }
        refresh = Auth().generate_refresh(token_data)
        await Auth().set_refresh_into_redis(str(jti))
        access = Auth().generate_access(token_data)
        # Merge the guest cart for the user if exists
        await self.merge_guest_cart_with_user(request, user.id)
        response = JSONResponse(
            status_code=200,
            content=SuccessResponse(
                data={"access": access}, message="Welcome to the mummy sweets"
            ).model_dump(),
        )
        response.set_cookie(
            "refresh",
            refresh,
            httponly=True,
            secure=settings.SECURE,
            samesite=settings.SAMESITE,
            max_age=settings.REFRESH_EXPIRY * 24 * 60 * 60,
        )
        return response

    async def merge_guest_cart_with_user(self, request: Request, user_id: uuid.UUID):
        guest_session_id = request.cookies.get("guest-session-id", None)
        if not guest_session_id:
            return
        await self.cart_service.merge_cart_user(user_id, guest_session_id)

    async def verify_otp(self, data: OtpVerifySchema):
        user = await self.repo.get_user_by_field("id", uuid.UUID(data.user_id))
        if not user:
            raise UserDoesnotExist
        if user.is_authenticated:
            raise HTTPException(status_code=400, detail="You are already verfied")
        is_locked, ttl = await Auth().is_locked_otp(data.user_id)
        if is_locked:
            ttl_min = ttl // 60
            raise ManyAttemptsError(
                message=f"Too many attempts.Please try again in {ttl_min if ttl_min != 0 else ttl} {'minutes' if ttl_min > 1 else 'second' if ttl < 1 else 'seconds'}"
            )
        user_otp = await Auth().get_otp_value(data.user_id)
        if not user_otp:
            await Auth().set_otp_attempt(data.user_id)
            raise InvalidOrExpiredOtp
        is_matched = user_otp == data.otp
        if not is_matched:
            await Auth().set_otp_attempt(data.user_id)
            raise InvalidOrExpiredOtp
        await Auth().delete_previous_otp_key(data.user_id)
        await Auth().delete_otp_attempt(data.user_id)
        user = await self.repo.authenticate_user(user)
        return SuccessResponse(message="You are now verified", data=None)

    async def resend_otp(self, data: RegisterSuccessResponseSchema):
        user = await self.repo.get_user_by_field("id", uuid.UUID(data.user_id))
        if not user:
            raise UserDoesnotExist
        can_resend, ttl = await Auth().can_resend(data.user_id)
        if not can_resend:
            raise HTTPException(
                status_code=400,
                detail=f"You can resend otp in {ttl} {'seconds' if ttl > 1 else 'second'}",
            )
        new_otp = Auth().generate_otp()
        await Auth().delete_previous_otp_key(data.user_id)
        await Auth().set_otp_key(new_otp, str(user.id))
        source = "email" if user.email else "phone"
        source_value = user.email if user.email else user.phone_no
        send_otp.delay(new_otp, source, [source_value], user.first_name)
        await Auth().set_resend_key(str(user.id))

        return SuccessResponse(
            data=None, message=f"Please check your {source}  for new otp"
        )

    async def refresh(self, request: Request):
        token = request.cookies.get("refresh")
        if not token:
            raise MissingToken
        payload = Auth().verify_token(token)
        session_id = payload["session_id"]
        session = await self.session_repo.get_session_by_id(session_id)
        if not session:
            raise InvalidSession
        if session.is_revoked:
            raise InvalidSession
        redis_refresh_jti = await Auth().get_refresh_from_redis(str(payload["jti"]))
        if redis_refresh_jti is None:
            # For concurrency in React strict mode
            if await Auth().get_old_rotation_into_redis(payload["jti"]) is None:
                raise InvalidOrExpiredToken
            return SuccessResponse(data={"message": "Rotation handled already"})

        old_jti = payload["jti"]
        new_jti = uuid.uuid4()
        payload["jti"] = str(new_jti)
        await self.session_repo.put_jti_into_session(new_jti, session)
        new_refresh = Auth().generate_refresh(payload)
        await Auth().set_old_rotation_into_redis(old_jti, str(new_jti))
        await Auth().delete_refresh_from_redis(old_jti)
        await Auth().set_refresh_into_redis(str(new_jti))
        new_access = Auth().generate_access(payload)
        response = JSONResponse(
            status_code=200,
            content=SuccessResponse(data={"access": new_access}).model_dump(),
        )
        response.set_cookie(
            "refresh",
            new_refresh,
            httponly=True,
            secure=settings.SECURE,
            samesite=settings.SAMESITE,
            max_age=settings.REFRESH_EXPIRY * 24 * 60 * 60,
        )
        return response

    # Forget Pass
    async def forget_password_otp_sender(self, data: ForgetPassSchema):
        field = "email" if data.email else "phone_no"
        value = data.email if data.email else data.mobile_number
        user = await self.repo.get_user_by_field(field, value)
        if not user:
            raise UserDoesnotExist

        otp = Auth().generate_otp()
        already_exist = await Auth().exist_reset_otp_key(str(user.id))
        if already_exist:
            return SuccessResponse(
                message=f"Please check your inbox sent in {field} for the otp",
                data={"user_id": str(user.id)},
            )

        send_reset_otp.delay(otp, field, [value], user.first_name)
        await Auth().set_reset_otp_key(str(user.id), str(otp))
        await Auth().set_resend_reset_otp_key(str(user.id))
        return SuccessResponse(
            message="Otp sent successfully", data={"user_id": str(user.id)}
        )

    # Resend the reset_otp
    async def resend_reset_otp(self, user_id: str):
        user = await self.repo.get_user_by_field("id", uuid.UUID(user_id))
        if not user:
            raise UserDoesnotExist
        can_resend, ttl = await Auth().can_resend_reset_otp(user_id)
        if not can_resend:
            raise HTTPException(
                status_code=403,
                detail=f"You can't resend the otp.Please try again after {ttl} {'seconds' if ttl > 1 else 'second'}",
            )
        field = "email" if user.email else "phone_no"
        value = user.email if user.email else user.phone_no
        new_otp = Auth().generate_otp()
        send_reset_otp.delay(new_otp, field, [value], user.first_name)
        await Auth().delete_old_reset_otp(str(user.id))
        await Auth().set_reset_otp_key(user_id, str(new_otp))
        await Auth().set_resend_reset_otp_key(str(user.id))
        return SuccessResponse(message="Resend otp sent successfully", data=None)

    # Verify reset key for forget password
    async def verify_reset_key(self, data: OtpVerifySchema):
        exist_key = await Auth().exist_reset_otp_key(data.user_id)
        if exist_key is None:
            await Auth().set_attempt_for_reset_otp(data.user_id)
            raise InvalidOrExpiredOtp
        is_locked_to_verify_reset_key, ttl = await Auth().is_locked_reset_otp(
            data.user_id
        )
        if is_locked_to_verify_reset_key:
            ttl_in_minute = ttl // 60
            raise ManyAttemptsError(
                message=f"Too many attempts.Please try again after {ttl_in_minute if ttl_in_minute > 1 else ttl} {'minutes' if ttl_in_minute > 1 else 'seconds' if ttl > 1 else 'second'}"
            )
        if data.otp != exist_key:
            await Auth().set_attempt_for_reset_otp(data.user_id)
            raise InvalidOrExpiredOtp
        await Auth().delete_old_reset_otp(data.user_id)
        await Auth().delete_reset_attempt(data.user_id)
        await Auth().delete_old_resend_reset_otp(data.user_id)
        await Auth().set_can_change_password(data.user_id)
        return SuccessResponse(message="Key verified", data={"user_id": data.user_id})

    # Change password after reset
    async def change_password_after_reset(self, data: ChangePasswordResetSchema):
        can_change = await Auth().can_change_password(data.user_id)
        if can_change is None:
            raise MissingKey(message="Request timeout please try again")
        user = await self.repo.get_user_by_field("id", uuid.UUID(data.user_id))
        if not user:
            raise UserDoesnotExist
        new_hash_password = Auth().hash_content(data.password_1)
        user = await self.repo.change_user_password(user, new_hash_password)
        await Auth().delete_can_change_user_from_reset(data.user_id)
        return SuccessResponse(message="Password changed successfully", data=None)

    async def logout_user(self, request: Request, response: Response):
        token = request.cookies.get("refresh", None)
        if token:
            payload = Auth().verify_token(token)
            jti = payload["jti"]
            await Auth().delete_refresh_from_redis(jti)
            response.delete_cookie("refresh")
            return SuccessResponse(message="Logged out successfully", data=None)

    async def create_oauth_user_or_login(
        self, request: Request, user_data: dict, user_profile_data: dict
    ):
        # Find whether the user exist already or not
        # IF oauth gives email then
        if user_data.get("email"):
            user = await self.repo.get_user_by_field("email", user_data.get("email"))
        else:
            user = await self.repo.get_user_by_field(
                "provider_id", user_data.get("provider_id")
            )
        if not user:
            new_user = await self.repo.create_user(user_data)
            user_profile_data["user_id"] = new_user.id
            await self.repo.create_profile(user_profile_data)
            return await self.check_user_session_and_create_response(
                request, new_user.id
            )
        return await self.check_user_session_and_create_response(request, user.id)

    async def check_user_session_and_create_response(
        self, request: Request, user_id: uuid.UUID
    ):
        new_jti = uuid.uuid4()
        device_id = request.query_params.get("state")
        if not device_id:
            raise MissingDeviceID
        # Check for the session
        session = await self.session_repo.get_session_by_device_id_user_id(
            device_id, user_id
        )
        if session:
            await self.session_repo.put_jti_into_session(new_jti, session)
        else:
            session = await self.session_repo.create_session(
                request, device_id, user_id, new_jti
            )  # type: ignore
        refresh = Auth().generate_refresh(
            {
                "jti": str(new_jti),
                "session_id": str(session.id),
                "user_id": str(user_id),
            }
        )
        await Auth().set_refresh_into_redis(str(new_jti))
        response = RedirectResponse(url=settings.FRONTEND_URL)
        response.set_cookie(
            key="refresh",
            value=refresh,
            httponly=True,
            samesite=settings.SAMESITE,
            secure=settings.SECURE,
            max_age=settings.REFRESH_EXPIRY * 24 * 60 * 60,
        )
        return response
