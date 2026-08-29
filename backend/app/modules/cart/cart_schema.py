from uuid import UUID

from pydantic import BaseModel


class CartItemBasic(BaseModel):
    id: UUID
    name: str
    quantity: int
    price: float


class CartItemsRead(BaseModel):
    items: list[CartItemBasic]
    total: float
    sub_total: float
    tax_amount: float
    delivery_fee: int
