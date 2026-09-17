from uuid import UUID

from pydantic import BaseModel

from app.modules.auth.schemas.user_schema import ProfileReadBasic
from app.modules.order.models.order_model import OrderChannel, OrderStatus
from app.modules.order.schemas.delivery_schema import DeliverySchema


class ProductReadBasicAdmin(BaseModel):
    id: UUID
    product_name: str
    average_preparation_time: int


class ReadBasicOrderItem(BaseModel):
    quantity: int
    product: ProductReadBasicAdmin


class ReadOrdersAdmin(BaseModel):
    id: UUID
    user: ProfileReadBasic
    delivery: DeliverySchema
    order_items: list[ReadBasicOrderItem]
    channel: OrderChannel
    average_preparation_time: int | None = None
    order_status: OrderStatus
