from uuid import UUID

from sqlalchemy import delete, insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.menu.models.relationship_model import wishlist_product
from app.modules.menu.models.wishlist_model import WishList
from app.modules.menu.repos.product_repo import ProductRepo


class WishlistRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.product_repo = ProductRepo(db)

    async def commit(self):
        await self.db.commit()

    async def create_wishlist(self, profile_id: UUID):
        wishlist = WishList()
        wishlist.profile_id = profile_id
        self.db.add(wishlist)
        await self.db.flush()
        return wishlist

    async def get_or_create_wishlist(self, profile_id: UUID):
        wishlist = (
            await self.db.execute(
                select(WishList).where(WishList.profile_id == profile_id)
            )
        ).scalar_one_or_none()
        if not wishlist:
            wishlist = await self.create_wishlist(profile_id)
        return wishlist

    async def is_product_in_wishlist(self, wishlist_id: UUID, product_id: UUID):
        exists = (
            await self.db.execute(
                select(wishlist_product.c.product_id).where(
                    wishlist_product.c.wishlist_id == wishlist_id,
                    wishlist_product.c.product_id == product_id,
                )
            )
        ).scalar_one_or_none()
        return exists is not None

    async def add_product(self, wishlist_id: UUID, product_id: UUID):
        await self.db.execute(
            insert(wishlist_product).values(
                wishlist_id=wishlist_id, product_id=product_id
            )
        )

    async def remove_product(self, wishlist_id: UUID, product_id: UUID):
        await self.db.execute(
            delete(wishlist_product).where(
                wishlist_product.c.wishlist_id == wishlist_id,
                wishlist_product.c.product_id == product_id,
            )
        )

    async def get_wishlist(self, profile_id: UUID):
        pass
