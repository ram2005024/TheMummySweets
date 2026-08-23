from typing import ClassVar

from fastapi import Query
from sqlalchemy import asc, desc, func

from app.modules.menu.models.category_model import Category
from app.modules.menu.models.product_model import Product
from app.modules.menu.models.review_model import Review


class FilterProduct:
    valid_sort_by_fields: ClassVar[tuple[str, ...]] = ("price", "-price")

    def __init__(
        self,
        fast_prepare: bool = Query(default=False, description="product_fast_prepared"),
        most_rated: bool = Query(default=False, description="most_rated_product"),
        sort_by: str | None = Query(None, description="sort_by_product"),
        search_by: str = Query(default=""),
        category: str | None = Query(None, description="category"),
    ) -> None:
        self.fast_prepare = fast_prepare
        self.most_rated = most_rated
        self.sort_by = sort_by
        self.category = category
        self.search_by = search_by

    async def filter_product(self, stmt):
        if self.fast_prepare:
            stmt = stmt.where(Product.average_preparation_time < 10)
        if self.most_rated:
            stmt = stmt.having(func.coalesce(func.avg(Review.rating), 0) > 3.5)
        if self.sort_by in ("+price", "-price", "+created_at", "-created_at"):
            sort_by_field = self.sort_by[1:]
            column = getattr(Product, sort_by_field)
            stmt = stmt.order_by(
                desc(column) if self.sort_by.startswith("-") else asc(column)
            )
        if self.category:
            stmt = stmt.join(Product.categories).where(
                Category.category_name.in_([self.category])
            )
        if self.search_by:
            stmt = stmt.where(
                Product.product_name.ilike(f"%{self.search_by}%")
                | Product.product_description.ilike(f"%{self.search_by}%")
                | Product.category_label.ilike(f"%{self.search_by}%")
            )
        return stmt
