from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.modules.admin.schemas.image_schemas import ImageResponse
from app.modules.order.models.order_model import OrderStatus
from app.modules.order.models.payment_model import PaymentMethod, PaymentStatus
from app.modules.order.schemas.delivery_schema import DeliveryReadBasic, DeliverySchema


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
    main_image: ImageResponse
    product_name: str
    is_best_seller: bool
    price: float
    stock_quantity: int
    is_available: bool

    model_config = ConfigDict(from_attributes=True)


class ProductReadWithCartValue(ProductReadBasic):
    quantity: int


class OrderItemBasic(BaseModel):
    price: int
    quantity: int
    product: ProductReadBasic

    model_config = ConfigDict(from_attributes=True)


class ProductCalculation(BaseModel):
    total: int
    sub_total: int
    delivery_fee: str | int
    vat_amount: int
    coupen_applied: str | None = None


class OrderCreate(BaseModel):
    order_status: OrderStatus
    profile_id: UUID
    payment_id: UUID


class OrderResponse(BaseModel):
    payment_method: PaymentMethod
    client_secret: str | None = None
    order_id: UUID
    payment_status: PaymentStatus
    amount: int
    calculation: ProductCalculation
    order_status: OrderStatus
    order_items: list[OrderItemBasic]
    delivery_details: DeliveryReadBasic

    @model_validator(mode="after")
    def validate_client_secret_for_external_payment(cls, values):
        if values.payment_method != PaymentMethod.COD and values.client_secret is None:
            raise ValueError("Client secret key missing")
        return values
