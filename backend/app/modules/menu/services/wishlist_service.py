from uuid import UUID

from app.modules.menu.repos.wishlist_repo import WishlistRepo


class WishlistService:
    def __init__(self, wishlist_repo: WishlistRepo) -> None:
        self.wishlist_repo = wishlist_repo

    async def add_product_to_wishlist(self, profile_id: UUID, product_id: UUID):
        pass
