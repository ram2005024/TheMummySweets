from uuid import UUID

from pydantic import BaseModel

from app.modules.auth.schemas.user_schema import UserReadBasic


class CommentReadBasic(BaseModel):
    comment: str
    user: UserReadBasic
    review_id: UUID
    id: UUID
