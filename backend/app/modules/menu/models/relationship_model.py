from sqlalchemy import Column, ForeignKey, Table

from app.core.db import Base

category_product = Table(
    "category_product",
    Base.metadata,
    Column(
        "product_id", ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "category_id", ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True
    ),
)
# Wishlist and Product
wishlist_product = Table(
    "wishlist_product",
    Base.metadata,
    Column(
        "wishlist_id", ForeignKey("wishlists.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "product_id", ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    ),
)
