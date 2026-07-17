from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ErrorResponse(BaseModel):
    success: bool = False
    message: Optional[str] = ""
    error_code: Optional[str] = ""
    details: Any = None


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    message: Optional[str] = ""
    data: T
