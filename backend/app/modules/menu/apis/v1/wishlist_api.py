from typing import Annotated

from fastapi import APIRouter, Depends

from app.modules.auth.models.user import Profile
from app.modules.menu.dependencies.factories_service import get_wishlist_service
from app.modules.menu.dependencies.wishlist_dependencies import (
    get_user_and_check_product,
)
from app.modules.menu.models.product_model import Product
from app.modules.menu.services.wishlist_service import WishlistService
from app.schemas.common import SuccessResponse

wishlist_api = APIRouter(prefix="/wishlist", tags=["Wishlist Endpoints"])


# To create the wishlist
@wishlist_api.post("/product/{product_id}", response_model=SuccessResponse[None])
async def create_wishlist_endpoint(
    res: Annotated[tuple[Profile, Product], Depends(get_user_and_check_product)],
    wishlist_service: Annotated[WishlistService, Depends(get_wishlist_service)],
):
    profile, product = res
    wishlist = await wishlist_service.add_product_to_wishlist(profile.id, product)
    if wishlist:
        return SuccessResponse(data=None, message="Added to wishlist")
