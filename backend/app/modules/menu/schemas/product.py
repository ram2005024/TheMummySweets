from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

from app.modules.admin.schemas.image_schemas import ImageResponse
from app.modules.menu.models.product_model import QuantizedUnit


class ProductCreate(BaseModel):
    product_name: str
    product_description: str | None = None
    category_label: str
    category_ids: list[UUID]
    discount_percentage: float | None = None
    price: float | None = None
    ingredients: list[str] | None = None
    stock_quantity: int | None = None
    average_preparation_time: int | None = None
    main_image: ImageResponse
    side_images: list[ImageResponse] | None = None

    @field_validator(
        "discount_percentage", "price", "stock_quantity", "average_preparation_time"
    )
    def positive_value(cls, value):
        if value is not None and value < 0:
            raise ValueError("Must be postive")
        return value


class ProductReadBasicCustomer(BaseModel):
    id: UUID
    main_image: ImageResponse
    is_best_seller: bool
    category_label: str
    product_name: str
    product_description: str
    rating: float = 0
    review_count: int = 0
    average_preparation_time: int
    price: int
    total_amount: float
    discount_percentage: float

    model_config = ConfigDict(from_attributes=True)


class ProductReadSingleCustomer(ProductReadBasicCustomer):
    ingredients: list[str] | None
    grouped_quantity: int
    grouped_unit: QuantizedUnit
    side_images: list[ImageResponse] | None
    is_available: bool

    model_config = ConfigDict(from_attributes=True)
