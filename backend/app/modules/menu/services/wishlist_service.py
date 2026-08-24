from uuid import UUID

from app.modules.menu.exceptions.wishlist_exceptions import ProductAlreadyInWishlist
from app.modules.menu.models.product_model import Product
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.menu.repos.wishlist_repo import WishlistRepo


class WishlistService:
    def __init__(self, wishlist_repo: WishlistRepo, product_repo: ProductRepo) -> None:
        self.product_repo = product_repo
        self.wishlist_repo = wishlist_repo

    async def add_product_to_wishlist(self, profile_id: UUID, product: Product):
        wishlist = await self.wishlist_repo.get_wishlist_of_user(profile_id)
        if wishlist:
            exists = await self.wishlist_repo.check_product_in_wishlist(
                wishlist, product
            )
            if exists:
                raise ProductAlreadyInWishlist
        wishlist = await self.wishlist_repo.create_wishlist(profile_id, product)
        return True
