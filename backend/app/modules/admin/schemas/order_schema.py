from uuid import UUID

from pydantic import BaseModel

from app.modules.auth.schemas.user_schema import ProfileReadBasic
from app.modules.order.schemas.delivery_schema import DeliverySchema
from app.modules.order.schemas.order_schema import ProductReadBasic


class ReadBasicOrderItem(BaseModel):
    quantity: int
    product: ProductReadBasic


class ReadOrdersAdmin(BaseModel):
    id: UUID
    user: ProfileReadBasic
    delivery: DeliverySchema
    order_items: list[ReadBasicOrderItem]
