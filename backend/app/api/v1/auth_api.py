from typing import Annotated

from fastapi import APIRouter, Depends, File, Request, UploadFile

from app.dependencies.factories import get_auth_service
from app.schemas.common import SuccessResponse
from app.schemas.user_schema import (
    OtpVerifySchema,
    RegisterSuccessResponseSchema,
    UserLogin,
    UserRegiser,
)
from app.services.auth_service import AuthService

auth_router=APIRouter(prefix="/auth",tags=["Auth endpoints"])

@auth_router.post("/register",response_model=SuccessResponse[RegisterSuccessResponseSchema])
async def register_endpoint(request:Request,data:Annotated[UserRegiser,Depends(UserRegiser.as_form)],auth_service:Annotated[AuthService,Depends(get_auth_service)],image:UploadFile=File(None)):
    result=await auth_service.register_user(data=data,image=image,request=request)
    return result

# For login
@auth_router.post("/login",response_model=SuccessResponse[dict])
async def login_endpoint(request:Request,data:UserLogin,auth_service:Annotated[AuthService,Depends(get_auth_service)]):
    return await auth_service.login_user(data,request)

# For verification
@auth_router.post("/verify/otp",response_model=SuccessResponse[None])
async def verify_user_token(data:OtpVerifySchema,service:Annotated[AuthService,Depends(get_auth_service)]):
    return await service.verify_otp(data)

# For resending the otp
@auth_router.post("/resend/otp",response_model=SuccessResponse[None])
async def resend_otp_endpoint(data:RegisterSuccessResponseSchema,service:Annotated[AuthService,Depends(get_auth_service)]):
    return await service.resend_otp(data)


