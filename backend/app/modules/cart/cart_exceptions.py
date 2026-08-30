from typing import Any

from app.exceptions.base_custom_exception import AppException


class CartAttributesMissing(AppException):
    def __init__(
        self,
        message: str = "Cart attributes missing",
        status_code: int = 404,
        error_code: str | None = "MISSING_ATTRIBUTES",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class CartNotFound(AppException):
    def __init__(
        self,
        message: str = "Cart not found",
        status_code: int = 404,
        error_code: str | None = "MISSING_CART",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class CartProductNotFound(AppException):
    def __init__(
        self,
        message: str = "Product doesn't exist inside the cart ",
        status_code: int = 404,
        error_code: str | None = "MISSING_PRODUCT_IN_CART`",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)
