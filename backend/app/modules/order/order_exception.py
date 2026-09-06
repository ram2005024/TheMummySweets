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


class InvalidCoupen(AppException):
    def __init__(
        self,
        message: str = "Invalid Coupen",
        status_code: int = 400,
        error_code: str | None = "INVALID_COUPEN",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class CoupenUnavailable(AppException):
    def __init__(
        self,
        message: str = "Coupen unavailable",
        status_code: int = 400,
        error_code: str | None = "COUPEN_UNAVAILABLE",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class LimitedProductStock(AppException):
    def __init__(
        self,
        message: str = "Product stock is limited",
        status_code: int = 400,
        error_code: str | None = "STOCK_LIMITED",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class OrderIdempotancyKeyMissing(AppException):
    def __init__(
        self,
        message: str = "Order idempotancy key is missing",
        status_code: int = 400,
        error_code: str | None = "ORDER_IDEMPOTANCY_KEY_MISSING",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class OrderIsAlreadyProcessing(AppException):
    def __init__(
        self,
        message: str = "Order already processing",
        status_code: int = 409,
        error_code: str | None = "ORDER_PROCESSING",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)
