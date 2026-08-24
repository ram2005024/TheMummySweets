from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel
from app.modules.menu.models.relationship_model import wishlist_product

if TYPE_CHECKING:
    from app.modules.auth.models.user import Profile
    from app.modules.menu.models.product_model import Product


class WishList(BaseModel):
    __tablename__ = "wishlists"

    profile_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE")
    )
    products: Mapped[list["Product"]] = relationship(
        "Product", secondary=wishlist_product, back_populates="wishlists"
    )
    user_profile: Mapped["Profile"] = relationship(
        "Profile", uselist=False, back_populates="wishlist"
    )
