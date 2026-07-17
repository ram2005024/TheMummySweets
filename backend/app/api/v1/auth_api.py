from typing import Annotated

from fastapi import APIRouter, Depends, File, Request, UploadFile

from app.dependencies.factories import get_auth_service
from app.schemas.common import SuccessResponse
from app.schemas.user_schema import UserRegiser
from app.services.auth_service import AuthService

auth_router=APIRouter(prefix="/auth",tags=["Auth endpoints"])

@auth_router.post("/register",response_model=SuccessResponse[None])
async def register_endpoint(request:Request,data:Annotated[UserRegiser,Depends(UserRegiser.as_form)],auth_service:Annotated[AuthService,Depends(get_auth_service)],image:UploadFile=File(None)):
    result=await auth_service.register_user(data=data,image=image,request=request)
    return result
