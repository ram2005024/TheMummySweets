

# Category-Product relationship table

from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.modules.auth.models.base import BaseModel
from app.modules.menu.models.relationship_model import category_product

if TYPE_CHECKING:
    from app.modules.menu.models.product_model import Product

class Category(BaseModel):
    __tablename__="categories"
    category_name:Mapped[str]
    products:Mapped[list["Product"]]=relationship("Product",secondary=category_product,back_populates="categories")



