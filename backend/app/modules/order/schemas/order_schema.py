from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field, model_validator

from app.modules.order.models.order_model import OrderStatus
from app.modules.order.models.payment_model import PaymentStatus
from app.modules.order.schemas.delivery_schema import DeliveryReadBasic, DeliverySchema


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


class ProductReadBasic(BaseModel):
    id: UUID
    main_image: str
    product_name: str
    is_best_seller: bool


class OrderItemBasic(BaseModel):
    price: int
    quantity: int
    product: ProductReadBasic


class OrderResponse(BaseModel):
    id: UUID
    payment_method: PaymentMethod
    client_secret: str | None = None
    order_id: UUID
    payment_status: PaymentStatus
    amount: int
    order_status: OrderStatus
    order_items: list[OrderItemBasic]
    delivery_details: DeliveryReadBasic

    @model_validator(mode="after")
    def validate_client_secret_for_external_payment(cls, values):
        if values.payment_method != PaymentMethod.COD and values.client_secret is None:
            raise ValueError("Client secret key missing")
        return values
