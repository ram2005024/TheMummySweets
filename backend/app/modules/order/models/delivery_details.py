from datetime import datetime
from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.modules.auth.models.base import BaseModel


class DeliveryTimingStatus(Enum):
    ASAP = "asap"
    SCHEDULED = "scheduled"


class DeliveryDetails(BaseModel):
    __tablename__ = "delivery_details"

    order_id: Mapped[UUID] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), unique=True
    )

    receiptent_name: Mapped[str]
    receiptent_phone: Mapped[str]
    delivery_address: Mapped[str]
    delivery_landmark: Mapped[str | None]
    delivery_timing: Mapped[DeliveryTimingStatus] = mapped_column(
        SQLEnum(DeliveryTimingStatus, name="delivery_timing_status"),
        default=DeliveryTimingStatus.ASAP,
    )
    delivery_note: Mapped[str | None]
    scheduled_time: Mapped[datetime | None] = mapped_column(default=datetime.now)
