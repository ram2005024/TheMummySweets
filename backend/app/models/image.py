

from sqlalchemy.orm import Mapped, mapped_column

from app.modules.auth.models.base import BaseModel


class Image(BaseModel):

    __tablename__="images"
    hash_value:Mapped[str]=mapped_column(unique=True,index=True)
    url:Mapped[str]
    width:Mapped[int]=mapped_column(nullable=True)
    height:Mapped[int]=mapped_column(nullable=True)

