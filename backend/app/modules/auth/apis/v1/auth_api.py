from typing import Annotated

from fastapi import APIRouter, Depends, File, Request, Response, UploadFile

from app.core.oauth2 import oauth
from app.modules.auth.dependencies.services import get_auth_service
from app.modules.auth.dependencies.user import get_user
from app.modules.auth.models.user import User
from app.modules.auth.schemas.user_schema import (
    ChangePasswordResetSchema,
    ForgetPassSchema,
    OtpVerifySchema,
    RegisterSuccessResponseSchema,
    UserLogin,
    UserReadBasic,
    UserRegiser,
)
from app.modules.auth.services.auth_service import AuthService
from app.schemas.common import SuccessResponse

auth_router = APIRouter(prefix="/auth", tags=["Auth endpoints"])


@auth_router.post(
    "/register", response_model=SuccessResponse[RegisterSuccessResponseSchema]
)
async def register_endpoint(
    request: Request,
    data: Annotated[UserRegiser, Depends(UserRegiser.as_form)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
    image: Annotated[UploadFile | None, File()] = None,
):
    result = await auth_service.register_user(data=data, image=image, request=request)
    return result


# For login
@auth_router.post("/login", response_model=SuccessResponse[dict])
async def login_endpoint(
    request: Request,
    data: UserLogin,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
):
    return await auth_service.login_user(data, request)


# For verification
@auth_router.post("/verify/otp", response_model=SuccessResponse[None])
async def verify_user_token(
    data: OtpVerifySchema, service: Annotated[AuthService, Depends(get_auth_service)]
):
    return await service.verify_otp(data)


# For resending the otp
@auth_router.post("/verify/resend/otp", response_model=SuccessResponse[None])
async def resend_otp_endpoint(
    data: RegisterSuccessResponseSchema,
    service: Annotated[AuthService, Depends(get_auth_service)],
):
    return await service.resend_otp(data)


# Refresh endpoint
@auth_router.post("/refresh", response_model=SuccessResponse[dict])
async def refresh_endpoint(
    request: Request, service: Annotated[AuthService, Depends(get_auth_service)]
):
    return await service.refresh(request)


# For forget-password
@auth_router.post(
    "/forget", response_model=SuccessResponse[RegisterSuccessResponseSchema]
)
async def forget_password_endpoint(
    data: ForgetPassSchema,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
):
    return await auth_service.forget_password_otp_sender(data)


# For reset resend otp
@auth_router.post("/forget/resend/{user_id}", response_model=SuccessResponse[None])
async def resend_reset_endpoint(
    user_id: str, auth_service: Annotated[AuthService, Depends(get_auth_service)]
):
    return await auth_service.resend_reset_otp(user_id)


# For reset resend otp


@auth_router.post(
    "/forget/verify", response_model=SuccessResponse[RegisterSuccessResponseSchema]
)
async def verify_forget_key_endpoint(
    data: OtpVerifySchema,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
):
    return await auth_service.verify_reset_key(data)


@auth_router.post("/forget/change", response_model=SuccessResponse[None])
async def change_password_after_forget_key_endpoint(
    data: ChangePasswordResetSchema,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
):
    return await auth_service.change_password_after_reset(data)


# Get the authenticated and valid user
@auth_router.get("/me", response_model=SuccessResponse[UserReadBasic])
async def get_user_endpoint(request: Request, user: Annotated[User, Depends(get_user)]):
    return SuccessResponse(data=user)


@auth_router.post("/logout", response_model=SuccessResponse[None])
async def logout_user_endpoint(
    request: Request,
    response: Response,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
):
    return await auth_service.logout_user(request, response)


# Oauth external endpoints
@auth_router.get("/login/google")
async def login_oauth(request: Request, device_id: str):
    redirect_url = request.url_for("oauth_callback")
    return await oauth.google.authorize_redirect(request, redirect_url, state=device_id)


# Callback route
@auth_router.get("/login/google/callback")
async def oauth_callback(
    request: Request, auth_service: Annotated[AuthService, Depends(get_auth_service)]
):
    token = await oauth.google.authorize_access_token(request)
    data = token.get("userinfo")
    user_data = {
        "first_name": data.get("given_name"),
        "last_name": data.get("family_name"),
        "email": data.get("email"),
        "phone_no": data.get("phone"),
        "provider": "google",
        "provider_id": data.get("sub"),
        "is_authenticated": True,
    }
    user_profile_data = {
        "image": data.get("picture"),
        "full_name": data.get("name"),
    }
    return await auth_service.create_oauth_user_or_login(
        request, user_data, user_profile_data
    )
