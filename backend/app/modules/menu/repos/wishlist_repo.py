from sqlalchemy.ext.asyncio import AsyncSession


class WishlistRepo:
    def __init__(self, wishlist_repo: AsyncSession) -> None:
        self.wishlist_repo = wishlist_repo
