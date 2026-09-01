from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import Profile
    from app.modules.order.models.payment_model import PaymentModel


class OrderStatus(Enum, str):
    PLACED = "placed"
    PREPARING = "preparing"
    SHIPPED = "shipped"
    ARRIVING = "arriving"
    DELIVERED = "delivered"
    CANCELED = "canceled"


class OrderModel(BaseModel):
    order_status: Mapped[OrderStatus] = mapped_column(
        ENUM(name="order_status"), default=OrderStatus.PREPARING
    )
    profile_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE")
    )
    payment_id: Mapped[UUID] = mapped_column(
        ForeignKey("payments.id", ondelete="CASCADE")
    )

    # relationship
    payment: Mapped["PaymentModel"] = relationship(
        "PaymentModel",
        uselist=False,
        back_populates="order",
        cascade="all,delete-orphan",
    )
    user: Mapped["Profile"] = relationship(
        "Profile", backref="orders", cascade="all,delete-orphan"
    )


"""
for order-items----->order_items
"""
