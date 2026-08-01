from typing import Any


class AppException(Exception):
    def __init__(
        self, message: str, status_code: int, error_code: str | None = None,details:Any=None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details=details
