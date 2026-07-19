import base64
import uuid

from fastapi import HTTPException, UploadFile
from fastapi.responses import JSONResponse
from starlette.requests import Request

from app.core.config import settings
from app.core.security import Auth
from app.exceptions.auth_exception import (
    InvalidEmailOrPassword,
    ManyAttemptsError,
    UserAlreadyExists,
    UserNotAuthenticated,
)
from app.repos.session_repo import SessionRepo
from app.repos.user_repo import UserRepo
from app.schemas.common import SuccessResponse
from app.schemas.user_schema import UserLogin, UserRegiser
from app.services.notification_service import NotificationService
from app.tasks.auth_task import upload_user_image
from app.tasks.email_task import send_email_otp


class AuthService:
    def __init__(self, repo: UserRepo,session_repo:SessionRepo):
        self.repo = repo
        self.session_repo=session_repo

        # Auth services
    async def register_user(self,data:UserRegiser,request:Request,image:UploadFile):
        if data.email:
            user=await self.repo.get_user_by_field("email",data.email)
            if user:
                raise UserAlreadyExists
        else:
            user=await self.repo.get_user_by_field("phone_no",data.mobile_number)
            if user:
                raise UserAlreadyExists
        create_data={
            "email":data.email or None,
            "password":Auth().hash_content(data.password_1),
            "phone_no":data.mobile_number or None,
            "first_name":data.first_name,
            "last_name":data.last_name
        }
        new_user=await self.repo.create_user(create_data)
        profile_data={
            "user_id":new_user.id,
            "full_name":f"{data.first_name} {data.last_name}",
        }
        await self.repo.create_profile(profile_data)
        if image and image.file:
            content=await image.read()
            image_string=base64.b64encode(content).decode("utf-8")
            upload_user_image.delay(image_string, str(new_user.id))
        # Generate the otp
        otp=Auth().generate_otp()
        await Auth().set_otp_key(otp,str(new_user.id))
        if data.email:
            send_email_otp.delay(email=[new_user.email],name=new_user.first_name,otp=str(otp))
            return SuccessResponse(message="User created.Please verify your email",data={"register_field":"email","email":new_user.email})

        if data.mobile_number:
            await NotificationService.send_sms_otp(otp=str(otp),phone_number=data.mobile_number)
            return SuccessResponse(message="User created.Please verify your phone number",data={"register_field":"phone","phone":new_user.phone_no})

    async def login_user(self,data:UserLogin,request:Request):
        is_locked,time=await Auth().is_locked(data.mobile_number if data.mobile_number else data.email)
        field_name="phone_no" if data.mobile_number else "email"
        value=data.mobile_number if data.mobile_number else data.email
        if is_locked:
            raise ManyAttemptsError(message=f"Too many attempts please try again after {time} {"minutes" if time>1 else "minute"}")
        user=await self.repo.get_user_by_field(field_name,value)
        if not user:
            await Auth().increase_attempt(value)
            raise InvalidEmailOrPassword
        if not user.is_authenticated:
            raise UserNotAuthenticated
        if user.provider and user.provider_id:
            raise HTTPException(status_code=400,detail="This account has different provider")

        if not Auth().verify_hash(data.password,user.password):
            await Auth().increase_attempt(value)
            raise InvalidEmailOrPassword
        jti=uuid.uuid4()
        device_id=f"{user.id}-{request.client.host}" # type: ignore
        # Check if the session exist or not
        session=await self.session_repo.get_session_by_device_id(device_id)
        if session:
            await self.session_repo.put_jti_into_session(jti,session)
        else:
            session=await self.session_repo.create_session(request,device_id,user.id,jti) #type:ignore
        token_data={
            "user_id":str(user.id),
            "jti":str(jti),
            "session_id":str(session.id),
        }
        refresh=Auth().generate_refresh(token_data)
        await Auth().set_refresh_into_redis(str(jti))
        access=Auth().generate_access(token_data)
        response=JSONResponse(status_code=200,content=SuccessResponse(data={"access":access},message="Welcome to the mummy sweets").model_dump())
        response.set_cookie("refresh",refresh,httponly=True,secure=settings.SECURE,samesite=settings.SAMESITE)
        return response



