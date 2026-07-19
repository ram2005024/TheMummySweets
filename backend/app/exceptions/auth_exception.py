from typing import Any

from fastapi import status

from app.exceptions.base_custom_exception import AppException


class InvalidEmailOrPassword(AppException):
    def __init__(
        self,
        message: str = "Invalid email or password",
        status_code: int = status.HTTP_404_NOT_FOUND,
        error_code: str = "INVALID_EMAIL_PASSWORD",
    ):
        super().__init__(message, status_code, error_code)


class UserAlreadyExists(AppException):
    def __init__(
        self,
        message: str = "User already exists",
        status_code: int = status.HTTP_404_NOT_FOUND,
        error_code: str = "USER_EXISTS",
    ):
        super().__init__(message, status_code, error_code)


class ManyAttemptsError(AppException):
    def __init__(
        self,
        message: str ="Too many attempts",
        status_code: int = status.HTTP_409_CONFLICT,
        error_code: str = "TOO_MANY_ATTEMPTS",
    ):
        super().__init__(message, status_code, error_code)


class InvaidOrExpiredToken(AppException):
    def __init__(
        self,
        message: str = "Invalid or Expired token",
        status_code: int = status.HTTP_401_UNAUTHORIZED,
        error_code: str = "INVALID_OR_EXPIRED_TOKEN",
    ):
        super().__init__(message, status_code, error_code)

class InvalidOrExpiredOtp(AppException):
    def __init__(
        self,
        message: str = "Invalid or Expired otp",
        status_code: int = status.HTTP_401_UNAUTHORIZED,
        error_code: str = "INVALID_OR_EXPIRED_OTP",
    ):
        super().__init__(message, status_code, error_code)



class PasswordMismatched(AppException):
    def __init__(
        self,
        message: str = "Password mismatched",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str = "PASSWORD_MISMATCHED",
    ):
        super().__init__(message, status_code, error_code)

class UserNotAuthenticated(AppException):
    def __init__(
        self,
        message: str = "Please verify your account",
        status_code: int = status.HTTP_401_UNAUTHORIZED,
        error_code: str = "USER_UNAUTHENTICATED",
        details:Any=None
    ):
        super().__init__(message, status_code, error_code,details=details)
class UserDoesnotExist(AppException):
    def __init__(
        self,
        message: str = "User doesn't exist",
        status_code: int = status.HTTP_401_UNAUTHORIZED,
        error_code: str = "USER_NOT_FOUND",
    ):
        super().__init__(message, status_code, error_code)
