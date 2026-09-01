from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import JSON, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import Profile
    from app.modules.order.models.coupen_model import CoupenModel
    from app.modules.order.models.order_model import OrderModel


class PaymentStatus(Enum, str):
    PAID = "paid"
    UNPAID = "unpaid"


class PaymentMethod(Enum, str):
    STRIPE = "stripe"
    ESEWA = "esewa"
    COD = "cod"


class PaymentModel(BaseModel):
    __table_name__ = "payments"
    amount: Mapped[float]
    payment_reference: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    payment_status: Mapped[PaymentStatus] = mapped_column(
        ENUM(name="payment_status"), default=PaymentStatus.UNPAID
    )
    payment_method: Mapped[PaymentMethod] = mapped_column(
        ENUM(name="payment_method"), default=PaymentMethod.COD
    )
    order_id: Mapped[UUID] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    coupen_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("coupens.id", ondelete="SET NULL")
    )
    payment_user_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE")
    )

    # Contraints check
    __table_args__ = (
        UniqueConstraint(
            "order_id", "payment_user_id", "id", name="uq_user_order_payment"
        ),
    )

    # relationships
    payment_user: Mapped["Profile"] = relationship(
        "Profile", back_populates="payments", cascade="all,delete-orphan"
    )
    payment_coupen: Mapped["CoupenModel"] = relationship(
        "CoupenModel", backref="used_payments", cascade="save-update,merge"
    )
    order: Mapped["OrderModel"] = relationship(
        "OrderModel",
        uselist=False,
        back_populates="payment",
        cascade="save-update,merge",
    )
