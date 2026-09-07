from typing import Any

from app.exceptions.base_custom_exception import AppException


class InvalidSignature(AppException):
    def __init__(
        self,
        message: str = "Invalid Signature",
        status_code: int = 400,
        error_code: str | None = "INVALID_SIGNATURE",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class MissingSignature(AppException):
    def __init__(
        self,
        message: str = "Missing Signature",
        status_code: int = 404,
        error_code: str | None = "MISSING_SIGNATURE",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class InvalidPayload(AppException):
    def __init__(
        self,
        message: str = "Invalid Payload",
        status_code: int = 400,
        error_code: str | None = "INVALID_PAYLOAD",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)
