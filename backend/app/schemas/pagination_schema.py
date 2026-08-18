from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Meta(BaseModel):
    page_no: int
    page_size: int
    limit: int
    has_next: bool
    has_previous: bool
    total: int
    filtered_total: int


class PaginatedResponse(BaseModel, Generic[T]):  # noqa: UP046
    meta: Meta
    data: T
