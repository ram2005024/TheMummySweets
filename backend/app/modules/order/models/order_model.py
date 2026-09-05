from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import Profile
    from app.modules.order.models.delivery_details import DeliveryDetails
    from app.modules.order.models.order_item_model import OrderItem
    from app.modules.order.models.payment_model import PaymentModel


class OrderStatus(Enum):
    PLACED = "placed"
    PENDING_PAYMENT = "pending_payment"
    PREPARING = "preparing"
    SHIPPED = "shipped"
    ARRIVING = "arriving"
    DELIVERED = "delivered"
    CANCELED = "canceled"


class OrderModel(BaseModel):
    __tablename__ = "orders"
    order_status: Mapped[OrderStatus] = mapped_column(
        SQLEnum(OrderStatus, name="order_status"), default=OrderStatus.PREPARING
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
    )
    user: Mapped["Profile"] = relationship(
        "Profile",
        back_populates="orders",
    )
    order_items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all,delete-orphan",
    )
    delivery: Mapped["DeliveryDetails"] = relationship(
        backref="order", uselist=False, cascade="all,delete-orphan"
    )
