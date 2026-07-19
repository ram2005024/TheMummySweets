from datetime import datetime
from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class UserRole(Enum):
    ADMIN = "admin"
    MEMBER = "member"
    RIDER = "rider"


class User(BaseModel):
    __tablename__ = "users"
    first_name:Mapped[str]
    last_name:Mapped[str]=mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=True)
    password: Mapped[str] = mapped_column(nullable=True)
    phone_no: Mapped[str] = mapped_column(unique=True, nullable=True)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, name="user role"), default=UserRole.MEMBER
    )
    is_active: Mapped[bool] = mapped_column(default=True)
    is_authenticated: Mapped[bool] = mapped_column(default=False)
    login_attempts: Mapped[int] = mapped_column(default=0)
    last_login_at: Mapped[datetime] = mapped_column(nullable=True)
    profile: Mapped["Profile"] = relationship("Profile",
        uselist=False, cascade="all,delete-orphan", back_populates="user"
    )
    provider:Mapped[str]=mapped_column(nullable=True)
    provider_id:Mapped[str]=mapped_column(unique=True,nullable=True)


class Profile(BaseModel):
    __tablename__ = "profiles"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id",ondelete="CASCADE"))
    user: Mapped["User"] = relationship(
        "User", foreign_keys=[user_id], back_populates="profile"
    )
    full_name: Mapped[str]
    image: Mapped[str] = mapped_column(nullable=True)
    total_orders: Mapped[int] = mapped_column(default=0)
    total_whishlists: Mapped[int] = mapped_column(default=0)
    total_cart_items: Mapped[int] = mapped_column(default=0)
    loyality_points: Mapped[int] = mapped_column(default=0)

    @property
    def rank(self) -> str:
        if self.loyality_points > 0 and self.loyality_points < 1000:
            return "bronze"
        elif self.loyality_points >= 1000 and self.loyality_points <= 5000:
            return "silver"
        elif self.loyality_points > 5000 and self.loyality_points <= 10000:
            return "gold"
        else:
            return "diamond"
