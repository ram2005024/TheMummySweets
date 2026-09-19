from typing import Any

from app.exceptions.base_custom_exception import AppException


class OrderUserDoesnotExist(AppException):
    def __init__(
        self,
        message: str = "Order user doesn't exist",
        status_code: int = 404,
        error_code: str | None = "ORDER_USER_NOT_FOUND",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)


class DeliveryRuleNotFound(AppException):
    def __init__(
        self,
        message: str = "Delivery rule doesn't exist",
        status_code: int = 404,
        error_code: str | None = "DELIVERY_RULE_NOT_FOUND",
        details: Any = None,
    ):
        super().__init__(message, status_code, error_code, details)
