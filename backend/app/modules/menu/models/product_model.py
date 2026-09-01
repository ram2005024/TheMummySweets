from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import ARRAY, CheckConstraint, String
from sqlalchemy.dialects.postgresql import ENUM, JSONB
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel
from app.modules.menu.models.relationship_model import (
    category_product,
    wishlist_product,
)
from app.modules.menu.models.review_model import Review

if TYPE_CHECKING:
    from app.modules.menu.models.category_model import Category
    from app.modules.menu.models.wishlist_model import WishList


class QuantizedUnit(str, Enum):
    LTR = "ltr"
    ML = "ml"
    PCS = "pcs"
    NA = "na"


class Product(BaseModel):
    __tablename__ = "products"

    product_name: Mapped[str]
    product_description: Mapped[str] = mapped_column(nullable=True)
    category_label: Mapped[str]
    is_available: Mapped[bool] = mapped_column(default=True)
    price: Mapped[int]
    discount_percentage: Mapped[float] = mapped_column(default=0)
    average_preparation_time: Mapped[int] = mapped_column(default=15)
    grouped_unit: Mapped[QuantizedUnit] = mapped_column(
        ENUM(QuantizedUnit), default=QuantizedUnit.NA
    )
    grouped_quantity: Mapped[int] = mapped_column(default=0)
    ingredients: Mapped[list[str]] = mapped_column(
        ARRAY(String), default=list, server_default="{}"
    )
    stock_quantity: Mapped[int]
    main_image: Mapped[dict] = mapped_column(JSONB)
    side_images: Mapped[list[dict]] = mapped_column(
        JSONB,
        default=list,
    )
    is_best_seller: Mapped[bool] = mapped_column(default=False)
    reviews: Mapped[list["Review"]] = relationship(
        "Review",
        back_populates="product",
        cascade="all, delete-orphan",
    )
    categories: Mapped[list["Category"]] = relationship(
        "Category", secondary=category_product, back_populates="products"
    )
    wishlists: Mapped[list["WishList"]] = relationship(
        "WishList", secondary=wishlist_product, back_populates="products"
    )
    __table_args__ = (
        CheckConstraint(
            "(grouped_unit = 'na' AND grouped_quantity = 0) "
            "OR (grouped_unit IN ('pcs','ml','ltr') AND grouped_quantity > 0)",
            name="grouped_quantity_positive_for_unit",
        ),
    )

    # Dynamic fields
    @hybrid_property
    def in_stock(self):
        return self.stock_quantity > 0

    @hybrid_property
    def total_amount(self):
        discount_amount = self.price * (self.discount_percentage / 100)
        return self.price - discount_amount

    # Extra args
    __table_args__ = (CheckConstraint("price > 0", name="Positive price value"),)
