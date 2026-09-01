from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import JSON, ForeignKey
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import Profile
    from app.modules.order.models.coupen_model import CoupenModel
    from app.modules.order.models.order_model import OrderModel


class PaymentStatus(str, Enum):
    PAID = "paid"
    UNPAID = "unpaid"


class PaymentMethod(str, Enum):
    STRIPE = "stripe"
    ESEWA = "esewa"
    COD = "cod"


class PaymentModel(BaseModel):
    __tablename__ = "payments"
    amount: Mapped[float]
    payment_reference: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    payment_status: Mapped[PaymentStatus] = mapped_column(
        ENUM(name="payment_status"), default=PaymentStatus.UNPAID
    )
    payment_method: Mapped[PaymentMethod] = mapped_column(
        ENUM(name="payment_method"), default=PaymentMethod.COD
    )

    coupen_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("coupens.id", ondelete="SET NULL")
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
