

# Category-Product relationship table
from typing import List

from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, relationship
from app.modules.menu.models.relationship_model import category_product
from app.core.db import Base
from app.modules.auth.models.base import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.modules.menu.models.product_model import Product



class Category(BaseModel):
    __tablename__="categories"
    category_name:Mapped[str]
    products:Mapped[List["Product"]]=relationship("Product",secondary=category_product,back_populates="categories")



