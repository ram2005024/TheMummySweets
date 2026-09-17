from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.modules.auth.schemas.user_schema import ProfileReadBasic
from app.modules.order.models.order_model import OrderChannel, OrderStatus
from app.modules.order.schemas.delivery_schema import DeliveryReadBasic


class ProductReadBasicAdmin(BaseModel):
    id: UUID
    product_name: str
    average_preparation_time: int
    model_config = ConfigDict(from_attributes=True)


class ReadBasicOrderItem(BaseModel):
    quantity: int
    product: ProductReadBasicAdmin
    model_config = ConfigDict(from_attributes=True)


class ReadOrdersAdmin(BaseModel):
    id: UUID
    user: ProfileReadBasic
    delivery: DeliveryReadBasic | None = None
    order_items: list[ReadBasicOrderItem]
    order_channel: OrderChannel
    average_preparation_time: int | None = None
    order_status: OrderStatus

    model_config = ConfigDict(from_attributes=True)
