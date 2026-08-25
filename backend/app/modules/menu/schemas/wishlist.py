from pydantic import BaseModel


class WishlistRequest(BaseModel):
    wishlist_state: bool
