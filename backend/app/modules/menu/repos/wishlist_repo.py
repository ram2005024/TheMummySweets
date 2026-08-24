from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.menu.models.product_model import Product
from app.modules.menu.models.wishlist_model import WishList
from app.modules.menu.repos.product_repo import ProductRepo


class WishlistRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.product_repo = ProductRepo(db)

    async def get_wishlist_of_user(self, user_profile_id: UUID):
        wishlist = (
            await self.db.execute(
                select(WishList).where(WishList.profile_id == user_profile_id)
            )
        ).scalar_one_or_none()
        return wishlist

    async def create_wishlist(self, profile_id: UUID, product: Product):
        wishlist = WishList(profile_id=profile_id)
        wishlist.products.append(product)
        self.db.add(wishlist)
        await self.db.commit()
        return wishlist

    async def check_product_in_wishlist(self, wishlist: WishList, product: Product):
        exists = (
            await self.db.execute(
                select(WishList)
                .where(WishList.id == wishlist.id)
                .where(WishList.products.any(Product.id == product.id))
            )
        ).scalar_one_or_none()
        return exists
