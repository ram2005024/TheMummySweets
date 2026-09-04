from uuid import UUID

from app.dependencies.pagination import Pagination
from app.modules.menu.dependencies.filter_products import FilterProduct
from app.modules.menu.exceptions.wishlist_exceptions import WishlistNotFound
from app.modules.menu.models.product_model import Product
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.menu.repos.wishlist_repo import WishlistRepo
from app.modules.menu.schemas.wishlist import (
    FilteredWishlistIDS,
    WishlistResponse,
)


class WishlistService:
    def __init__(self, wishlist_repo: WishlistRepo, product_repo: ProductRepo) -> None:
        self.wishlist_repo = wishlist_repo
        self.product_repo = product_repo

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

    async def get_wishlist_items(
        self, profile_id: UUID, pagination_data: Pagination, filter_data: FilterProduct
    ):
        wishlist = await self.wishlist_repo.get_or_create_wishlist(profile_id)
        products = await self.product_repo.read_wishlist_products(
            filter_data, pagination_data, wishlist.id
        )
        return WishlistResponse(wishlist_id=wishlist.id, products=products)

    async def get_wishlisted_product_ids(
        self, product_ids: list[UUID], user_profile_id: UUID
    ):
        wishlisted_ids = await self.wishlist_repo.filter_wishlisted_ids(user_profile_id)
        if len(wishlisted_ids) == 0:
            return
        filtered_ids = [id for id in product_ids if id in wishlisted_ids]
        return FilteredWishlistIDS(wishlisted_ids=filtered_ids)

    async def delete_wishlist_product(self, wishlist_id, product_id: UUID):
        wishlist = await self.wishlist_repo.find_wishlist_by_id(wishlist_id)
        if not wishlist:
            raise WishlistNotFound
        product = await self.wishlist_repo.is_product_in_wishlist(
            wishlist_id, product_id
        )
        if not product:
            return
        await self.wishlist_repo.remove_product_from_wishlist(wishlist, product)
