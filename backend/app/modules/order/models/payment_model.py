from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import JSON, ForeignKey
from sqlalchemy import Enum as SQLAlchemyENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import Profile
    from app.modules.order.models.coupen_model import CoupenModel
    from app.modules.order.models.order_model import OrderModel


class PaymentStatus(Enum):
    PAID = "paid"
    UNPAID = "unpaid"


class PaymentMethod(Enum):
    STRIPE = "stripe"
    ESEWA = "esewa"
    COD = "cod"


class PaymentModel(BaseModel):
    __tablename__ = "payments"
    amount: Mapped[float]
    payment_reference: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    payment_status: Mapped[PaymentStatus] = mapped_column(
        SQLAlchemyENUM(PaymentStatus, name="payment_status"),
        default=PaymentStatus.UNPAID,
    )
    payment_method: Mapped[PaymentMethod] = mapped_column(
        SQLAlchemyENUM(PaymentMethod, name="payment_method"), default=PaymentMethod.COD
    )
    profile_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE")
    )
    coupen_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("coupens.id", ondelete="SET NULL")
    )

    # relationships
    payment_user: Mapped["Profile"] = relationship("Profile")
    payment_coupen: Mapped["CoupenModel"] = relationship("CoupenModel")
    order: Mapped["OrderModel"] = relationship(
        "OrderModel",
        uselist=False,
        back_populates="payment",
        cascade="save-update,merge",
    )
