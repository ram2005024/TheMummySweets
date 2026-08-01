from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ErrorResponse(BaseModel):
    success: bool = False
    message: str | None = ""
    error_code: str | None = ""
    details: Any = None


class SuccessResponse(BaseModel, Generic[T]):  # noqa: UP046
    success: bool = True
    message: str | None = ""
    data: T
