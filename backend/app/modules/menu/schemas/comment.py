from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.modules.auth.schemas.user_schema import UserReadBasic


class CommentReadBasic(BaseModel):
    comment: str
    user: UserReadBasic
    review_id: UUID
    id: UUID

    model_config = ConfigDict(from_attributes=True)
