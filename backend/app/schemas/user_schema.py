from typing import Optional

from fastapi import Form
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, EmailStr, field_validator, model_validator

from app.exceptions.auth_exception import PasswordMismatched
from app.utils.normalize_phone import normalize_phone


class UserRegiser(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: Optional[EmailStr]=None
    mobile_number:Optional[str]=None
    password_1: str
    password_2: str

    @field_validator("first_name","last_name",mode="before")
    def normalize_names(cls,value:str)->str:
        return value.strip().title()

    @field_validator("email",mode="before")
    def normalize_email(cls,value:str)->str:
        if not value:
            return value
        return value.strip().lower()

    @model_validator(mode="after")
    def check_password(self):
        if self.password_1!=self.password_2:
            raise PasswordMismatched
        return self


    @model_validator(mode="after")
    def validate_email_phone(self):
        if self.email and self.mobile_number:
            raise HTTPException(status_code=400,detail="Either email or phone number can be registered")
        if not self.email and not self.mobile_number:
            raise HTTPException(status_code=400,detail="Either email or phone number should be provided")

        return self

    @field_validator("mobile_number",mode="before")
    def normalize_mobile(cls,value):
        if not value:
            return value
        value=normalize_phone(value)
        return value


    # For form field
    @staticmethod
    def as_form(
                first_name:str=Form(...),
                last_name:Optional[str]=Form(None),
                password_1:str=Form(...),
                password_2:str=Form(...),
                email:Optional[str]=Form(None),
                mobile_number:Optional[str]=Form(None),
                ):
        return UserRegiser(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password_1=password_1,
            password_2=password_2,
            mobile_number=mobile_number
        )

# User login
class UserLogin(BaseModel):
    email:Optional[str]=None
    mobile_number:Optional[str]=None
    password:str
    @model_validator(mode="after")
    def validate_email_phone(self):
        if self.email and self.mobile_number:
            raise HTTPException(status_code=400,detail="Either email or phone number can be used for login")
        if not self.email and not self.mobile_number:
            raise HTTPException(status_code=400,detail="Either email or phone number should be provided")
        return self

    @field_validator("email",mode="after")
    def normalize_email(cls,value:str):
        if not value:
            return value
        return value.strip().lower()

    @field_validator("mobile_number",mode="before")
    def normalize_mobile(cls,value:str):
        if not value:
            return value
        value=normalize_phone(value)
        return value

class OtpVerifySchema(BaseModel):
    field_name:str
    field_value:str
    user_id:str
    otp:str

class RegisterSuccessResponseSchema(BaseModel):
    field_name:str
    field_value:str
    user_id:str
