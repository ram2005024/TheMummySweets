from typing import Any

from app.exceptions.base_custom_exception import AppException


class ProductUnavailable(AppException):
    def __init__(
        self,
        message: str = "Product/s unavailable",
        status_code: int = 404,
        error_code: str | None = "PRODUCT_UNAVAILABLE",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)
