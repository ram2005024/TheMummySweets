

from typing import TYPE_CHECKING

from sqlalchemy import ARRAY, CheckConstraint, String, func, select
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel
from app.modules.menu.models.relationship_model import category_product
from app.modules.menu.models.review_model import Review

if TYPE_CHECKING:
    from app.modules.menu.models.category_model import Category



class Product(BaseModel):
    __tablename__="products"

    product_name:Mapped[str]
    product_description:Mapped[str]=mapped_column(nullable=True)
    category_label:Mapped[str]
    is_available:Mapped[bool]=mapped_column(default=True)
    price:Mapped[int]
    discount_percentage:Mapped[float]=mapped_column(default=0)
    average_preparation_time:Mapped[int]=mapped_column(default=15)
    grouped_quantity:Mapped[int]=mapped_column(default=0)
    ingredients:Mapped[list[str]]=mapped_column(ARRAY(String),default=list,server_default="{}")
    stock_quantity:Mapped[int]
    main_image:Mapped[str]
    side_images:Mapped[list[str]]=mapped_column(ARRAY(String),default=list,server_default="{}")
    reviews:Mapped[list["Review"]]=relationship("Review")
    categories:Mapped[list["Category"]]=relationship("Category",secondary=category_product)

    # Dynamic fields
    @hybrid_property
    def in_stock(self):
        return self.stock_quantity>0


    @hybrid_property
    def total_amount(self):
        discount_amount=self.price*self.discount_percentage
        return self.price-discount_amount

    @hybrid_property
    def average_rating(self): # type: ignore
        if not self.reviews:
            return 0
        sum_rating=sum(rating for rating in self.reviews)
        ratings_count=len(self.reviews)
        return sum_rating/ratings_count

    @average_rating.expression # type: ignore
    def average_rating(cls):
        return (
            select(func.avg(Review.rating))
            .where(Review.product_id==cls.id)
            .correlate(cls)
            .scalar_subquery()
        )


    # Extra args
    __tableargs__=(
        CheckConstraint("price > 0",name="Positive price value")
    )
