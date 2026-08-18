from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import User
    from app.modules.menu.models.product_model import Product


# Comment
class Comment(BaseModel):
    __tablename__ = "comments"
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    comment: Mapped[str]
    review_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "reviews.id",
            ondelete="CASCADE",
        )
    )
    # sqlalchemy field
    user: Mapped["User"] = relationship("User")
    review: Mapped["Review"] = relationship("Review", back_populates="comment")


class Review(BaseModel):
    __tablename__ = "reviews"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE")
    )
    like_count: Mapped[int] = mapped_column(default=0)
    rating: Mapped[float] = mapped_column(default=5)
    # sqlalchemy field
    comment: Mapped["Comment"] = relationship(
        "Comment", uselist=False, back_populates="review"
    )
    product: Mapped["Product"] = relationship(
        "Product",
        back_populates="reviews",
    )

    # Extra args
    __table_args__ = (
        CheckConstraint("rating>0 and rating <=5", name="Rating boundary"),
    )
