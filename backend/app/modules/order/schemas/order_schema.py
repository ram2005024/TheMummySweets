from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field

from app.modules.order.schemas.delivery_schema import DeliverySchema


class PaymentMethod(Enum):
    ESEWA = "esewa"  # will be implemented later
    STRIPE = "stripe"
    COD = "cod"


class CartItems(BaseModel):
    id: UUID
    quantity: int = Field(ge=1)


class OrderRequest(BaseModel):
    delivery_details: DeliverySchema
    payment_method: PaymentMethod
    applied_coupen: str | None = None
    cart_items: list[CartItems]
