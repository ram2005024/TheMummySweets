
from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Session(BaseModel):

    __tablename__="sessions"

    user_id:Mapped[UUID]=mapped_column(unique=True)
    device_id:Mapped[str]=mapped_column(unique=True)
    os:Mapped[str]=mapped_column(nullable=True)
    last_login:Mapped[datetime]=mapped_column(default=datetime.now())
    is_revoked:Mapped[bool]=mapped_column(default=False)
    jti:Mapped[UUID]=mapped_column(unique=True)
    browser:Mapped[str]=mapped_column(nullable=True)
    user_agent:Mapped[str]=mapped_column(nullable=True)


