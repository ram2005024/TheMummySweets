from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.menu.models.product_model import Product
    from app.modules.order.models.order_model import OrderModel


class OrderItem(BaseModel):
    __tablename__ = "order_items"
    product_id: Mapped[UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE")
    )
    quantity: Mapped[int]
    price: Mapped[float]
    order_id: Mapped[UUID] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))

    product: Mapped["Product"] = relationship("Product", cascade="all,delete-orphan")
    order: Mapped["OrderModel"] = relationship(
        "OrderModel",
        backref="order_items",
        cascade="all,delete-orphan",
    )
