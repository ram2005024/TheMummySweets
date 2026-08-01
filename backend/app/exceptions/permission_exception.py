


from app.exceptions.base_custom_exception import AppException


class UserNotAllowed(AppException):
    def __init__(self, message: str="User not allowed", status_code: int=403, error_code: str  = "USER_FORBIDDEN"):
        super().__init__(message, status_code, error_code)
