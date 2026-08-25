from uuid import UUID

from app.modules.menu.models.product_model import Product
from app.modules.menu.repos.wishlist_repo import WishlistRepo


class WishlistService:
    def __init__(self, wishlist_repo: WishlistRepo) -> None:
        self.wishlist_repo = wishlist_repo

    async def manage_product_in_wishlist(
        self, product: Product, profile_id: UUID, is_wishlisted: bool
    ):
        # Get or create the wishlist of user
        wishlist = await self.wishlist_repo.get_or_create_wishlist(profile_id)
        # Check the product already in wishlist or not
        product_in_wishlist = await self.wishlist_repo.is_product_in_wishlist(
            wishlist.id, product.id
        )
        if is_wishlisted and not product_in_wishlist:
            await self.wishlist_repo.add_product(wishlist.id, product.id)
        elif not is_wishlisted and product_in_wishlist:
            await self.wishlist_repo.remove_product(wishlist.id, product.id)
        await self.wishlist_repo.commit()
