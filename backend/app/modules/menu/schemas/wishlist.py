from uuid import UUID

from pydantic import BaseModel

from app.modules.menu.schemas.product import ProductReadBasicCustomer
from app.schemas.pagination_schema import PaginatedResponse


class WishlistRequest(BaseModel):
    wishlist_state: bool


class WishlistResponse(BaseModel):
    wishlist_id: UUID
    products: PaginatedResponse[list[ProductReadBasicCustomer]]
