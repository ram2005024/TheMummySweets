import datetime
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import User  # Noqa


class CoupenModel(BaseModel):
    code: Mapped[str]
    expiry_date: Mapped[datetime.datetime]
    discount_percentage: Mapped[int]
    max_discount_amount: Mapped[float]

    # relationship
    coupen_used_users = relationship(
        "User", secondary="coupen_used_users", backref="used_coupens"
    )
    coupen_valid_users = relationship(
        "User", secondary="coupen_valid_users", backref="valid_coupens"
    )
