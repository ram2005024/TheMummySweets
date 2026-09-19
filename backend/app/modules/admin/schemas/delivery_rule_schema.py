from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CreateDeliveryRule(BaseModel):
    start_km: int
    end_km: int
    delivery_thresold: int
    delivery_fee: int


class ReadDeliveryRule(CreateDeliveryRule):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class UpdateDeliveryRule(BaseModel):
    start_km: int | None = None
    end_km: int | None = None
    delivery_thresold: int | None = None
    delivery_fee: int | None = None
