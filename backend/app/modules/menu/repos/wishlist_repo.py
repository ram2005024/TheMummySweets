from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.menu.models.wishlist_model import WishList


class WishlistRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_wishlist_of_user(self, user_profile_id: UUID):
        wishlist = (
            await self.db.execute(
                select(WishList).where(WishList.profile_id == user_profile_id)
            )
        ).scalar_one_or_none()
        return wishlist
