from uuid import UUID

from app.dependencies.pagination import Pagination
from app.modules.menu.dependencies.filter_products import FilterProduct
from app.modules.menu.models.product_model import Product
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.menu.repos.wishlist_repo import WishlistRepo
from app.modules.menu.schemas.wishlist import WishlistResponse


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
