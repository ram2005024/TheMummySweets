


from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.models.base import BaseModel

if TYPE_CHECKING:
    from app.modules.auth.models.user import User

# Comment
class Comment(BaseModel):
    __tablename__="comments"
    user_id:Mapped[UUID]=mapped_column(ForeignKey("users.id"))
    comment:Mapped[str]
    review_id:Mapped[UUID]=mapped_column(ForeignKey("reviews.id"))
    # sqlalchemy field
    user:Mapped["User"]=relationship("User")



class Review(BaseModel):

    __tablename__="reviews"

    user_id:Mapped[UUID]=mapped_column(ForeignKey("users.id"))
    product_id:Mapped[UUID]=mapped_column(ForeignKey("products.id"))
    like_count:Mapped[int]=mapped_column(default=0)
    rating:Mapped[float]=mapped_column(default=5)
    # sqlalchemy field
    comments:Mapped[list["Comment"]]=relationship("Comment",cascade="all,delete-orphan")



    # Extra args
    __tableargs__=(
        CheckConstraint("rating>0 and rating <=5",name="Rating boundary")
    )
