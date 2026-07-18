import base64

from fastapi import Request, UploadFile

from app.core.security import Auth
from app.exceptions.auth_exception import UserAlreadyExists
from app.repos.user_repo import UserRepo
from app.schemas.common import SuccessResponse
from app.schemas.user_schema import UserRegiser
from app.services.notification_service import NotificationService
from app.tasks.auth_task import upload_user_image
from app.tasks.email_task import send_email_otp


class AuthService:
    def __init__(self, repo: UserRepo):
        self.repo = repo

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
            return SuccessResponse(message="User created.Verification code has been sent",data=None)
        if data.mobile_number:
            await NotificationService.send_sms_otp(otp=str(otp),phone_number=data.mobile_number)
            return SuccessResponse(message="User created.Please verify your phone number",data=None)
