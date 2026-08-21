from uuid import UUID

from fastapi import Form
from pydantic import BaseModel, ConfigDict, field_validator

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

    @field_validator(
        "discount_percentage", "price", "stock_quantity", "average_preparation_time"
    )
    def positive_value(cls, value):
        if value is not None and value < 0:
            raise ValueError("Must be postive")
        return value

    @classmethod
    def as_form(
        cls,
        product_name: str = Form(...),
        product_description: str = Form(None),
        category_label: str = Form(...),
        category_ids: list[str] = Form(...),  # noqa: B008
        discount_percentage: float = Form(None),
        price: float = Form(...),
        ingredients: list[str] | None = Form(None),  # noqa: B008
        stock_quantity: int = Form(...),
        average_preparation_time: int = Form(None),
    ):
        return cls(
            product_name=product_name,
            product_description=product_description,
            category_label=category_label,
            category_ids=[UUID(id) for id in category_ids],
            discount_percentage=discount_percentage,
            price=price,
            ingredients=ingredients,
            stock_quantity=stock_quantity,
            average_preparation_time=average_preparation_time,
        )


class ProductReadBasicCustomer(BaseModel):
    main_image: str | None = None
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
    side_images: list[str] | None
    is_available: bool

    model_config = ConfigDict(from_attributes=True)
