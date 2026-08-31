from typing import Any

from app.exceptions.base_custom_exception import AppException


class InvalidImageFormat(AppException):
    def __init__(
        self,
        message: str = "Invalid image format.Allowed types are png,jpeg",
        status_code: int = 405,
        error_code: str | None = "INVALID_IMAGE_FORMAT",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)
