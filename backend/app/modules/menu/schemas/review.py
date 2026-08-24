import datetime
from uuid import UUID

from pydantic import BaseModel

from app.modules.auth.schemas.user_schema import UserReadBasic
from app.modules.menu.schemas.comment import CommentReadBasic


class ReadReviewBasic(BaseModel):
    like_count: int
    rating: float
    review_title: str
    review_description: str | None
    user: UserReadBasic
    comments: list[CommentReadBasic] = []
    product_id: UUID
    created_at: datetime.datetime
