import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.modules.auth.schemas.user_schema import UserReadBasic
from app.modules.menu.schemas.comment import CommentReadBasic
from app.schemas.pagination_schema import PaginatedResponse


class ReadReviewBasic(BaseModel):
    like_count: int
    rating: float
    review_title: str
    review_description: str | None
    user: UserReadBasic
    comments: list[CommentReadBasic] = []
    product_id: UUID
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)


class ReviewStats(BaseModel):
    avg_rating: float
    distribution: dict[int, int]


class ReviewReadResponse(PaginatedResponse[list[ReadReviewBasic]]):
    stats: ReviewStats
