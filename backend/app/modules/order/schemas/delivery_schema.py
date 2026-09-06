from datetime import UTC, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator

from app.modules.order.models.delivery_details import DeliveryTimingStatus


class DeliverySchema(BaseModel):
    receiptent_name: str
    delivery_address: str
    delivery_timing: DeliveryTimingStatus = DeliveryTimingStatus.ASAP
    delivery_note: str | None = None
    scheduled_time: datetime | None = None
    receiptent_phone: str
    delivery_landmark: str

    @model_validator(mode="after")
    def verify_scheduled_date_for_schedule(cls, values):
        is_scheduled = values.delivery_timing == DeliveryTimingStatus.SCHEDULED
        if is_scheduled and values.scheduled_time is None:
            raise ValueError("Scheduled time is required for scheduled delivery")
        if is_scheduled and values.scheduled_time:
            now = datetime.now(UTC)
            if now > values.scheduled_time:
                raise ValueError("Scheduled date is in past")
        return values


class DeliveryReadBasic(BaseModel):
    receiptent_name: str
    delivery_address: str
    delivery_timing: DeliveryTimingStatus
    delivery_note: str | None = None
    scheduled_time: datetime | None = None
    receiptent_phone: str
    delivery_landmark: str

    model_config = ConfigDict(from_attributes=True)


class DeliveryCreate(DeliveryReadBasic):
    order_id: UUID
