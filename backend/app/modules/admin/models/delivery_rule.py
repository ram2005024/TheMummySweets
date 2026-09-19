from sqlalchemy.orm import Mapped

from app.modules.auth.models.base import BaseModel


class DeliveryRule(BaseModel):
    __tablename__ = "delivery_rules"

    start_km: Mapped[int]
    end_km: Mapped[int]
    delivery_thresold: Mapped[int]
    delivery_fee: Mapped[int]
