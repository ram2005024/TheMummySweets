from uuid import UUID

from pydantic import BaseModel, Field

from app.modules.menu.models.product_model import QuantizedUnit


class CartItemBasic(BaseModel):
    id: UUID
    name: str
    quantity: int
    price: float
    main_image: str
    quantized_unit: QuantizedUnit


class CartItemsRead(BaseModel):
    items: list[CartItemBasic]
    total: float
    sub_total: float
    tax_amount: float
    delivery_fee: int


class CartUpdate(BaseModel):
    quantity: int = Field(ge=1)
