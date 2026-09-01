import datetime
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import User  # Noqa


class CoupenModel(BaseModel):
    __tablename__ = "coupens"
    code: Mapped[str]
    expiry_date: Mapped[datetime.datetime]
    required_amount: Mapped[float]
    discount_percentage: Mapped[int]
    max_discount_amount: Mapped[float]
    max_use_count: Mapped[int]
    used_count: Mapped[int] = mapped_column(default=0)
    is_active: Mapped[bool] = mapped_column(default=True)
    # relationship
    coupen_used_users = relationship(
        "User", secondary="coupen_used_users", backref="used_coupens"
    )
    coupen_valid_users = relationship(
        "User", secondary="coupen_valid_users", backref="valid_coupens"
    )
