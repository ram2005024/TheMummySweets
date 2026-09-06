from uuid import UUID

from sqlalchemy import delete, insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.models.user import User
from app.modules.order.models.coupen_model import CoupenModel
from app.modules.order.models.relationship import coupen_used_users, coupen_valid_users


class CoupenRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def has_coupen(self, coupen: str):
        return (
            await self.db.execute(select(CoupenModel).where(CoupenModel.code == coupen))
        ).scalar_one_or_none()

    async def is_coupen_valid_for_user(self, user: User, coupen: CoupenModel):
        valid_user = (
            await self.db.execute(
                select(CoupenModel)
                .join(coupen_valid_users, coupen_valid_users.c.coupen_id == coupen.id)
                .join(User, coupen_valid_users.c.user_id == User.id)
                .where(CoupenModel.id == coupen.id, User.id == user.id)
            )
        ).scalar_one_or_none()
        return valid_user is not None

    async def remove_valid_coupen_user_and_add_into_used_user(
        self, user_id: UUID, coupen: CoupenModel
    ):
        stmt = delete(coupen_valid_users).where(
            coupen_valid_users.c.user_id == user_id,
            coupen_used_users.c.coupen_id == coupen.id,
        )
        await self.db.execute(stmt)
        await self.db.execute(
            insert(coupen_used_users).values(user_id=user_id, coupen_id=coupen.id)
        )
