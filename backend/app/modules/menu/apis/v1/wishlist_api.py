from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.dependencies.pagination import Pagination
from app.dependencies.permission import RolePermission
from app.modules.auth.models.user import Profile, User
from app.modules.menu.dependencies.factories_service import get_wishlist_service
from app.modules.menu.dependencies.filter_products import FilterProduct
from app.modules.menu.dependencies.wishlist_dependencies import (
    get_user_and_check_product,
)
from app.modules.menu.models.product_model import Product
from app.modules.menu.schemas.wishlist import (
    FilteredWishlistIDS,
    FilterIDSWishlist,
    WishlistRequest,
    WishlistResponse,
)
from app.modules.menu.services.wishlist_service import WishlistService
from app.schemas.common import SuccessResponse

wishlist_api = APIRouter(prefix="/wishlist", tags=["Wishlist Endpoints"])


# To create the wishlist
@wishlist_api.put("/product/{product_id}", response_model=SuccessResponse[None])
async def create_wishlist_endpoint(
    data: WishlistRequest,
    res: Annotated[tuple[Profile, Product], Depends(get_user_and_check_product)],
    wishlist_service: Annotated[WishlistService, Depends(get_wishlist_service)],
):
    profile, product = res
    await wishlist_service.manage_product_in_wishlist(
        product, profile.id, data.wishlist_state
    )
    return SuccessResponse(
        data=None,
        message=f"Product {'added' if data.wishlist_state else 'removed'} {'into' if data.wishlist_state else 'from'} wishlist",
    )


# To read wishlist of the user
@wishlist_api.get("/", response_model=SuccessResponse[WishlistResponse])
async def read_wishlist_of_user(
    user: Annotated[User, Depends(RolePermission(["member", "admin"]))],
    wishlist_service: Annotated[WishlistService, Depends(get_wishlist_service)],
    pagination_data: Annotated[Pagination, Depends()],
    filter_data: Annotated[FilterProduct, Depends()],
):

    result = await wishlist_service.get_wishlist_items(
        user.profile.id, pagination_data, filter_data
    )
    return SuccessResponse(data=result)


# To filter the wishlist ids from the given pids
@wishlist_api.post(
    "/status/product", response_model=SuccessResponse[FilteredWishlistIDS]
)
async def filter_wishlist_product_ids(
    user: Annotated[User, Depends(RolePermission(["admin", "member"]))],
    product_ids: FilterIDSWishlist,
    wishlist_service: Annotated[WishlistService, Depends(get_wishlist_service)],
):
    await wishlist_service.get_wishlisted_product_ids(product_ids.ids, user.profile.id)


# To delete the product from the wishlist
@wishlist_api.delete("/{product_id}", response_model=SuccessResponse[None])
async def delete_product_from_wishlist(
    user: Annotated[Profile, Depends(get_user_and_check_product)],
    product_id: UUID,
    wishlist_service: Annotated[WishlistService, Depends(get_wishlist_service)],
):
    await wishlist_service.delete_wishlist_product(user.wishlist.id, product_id)
    return SuccessResponse(message="Deleted product from wishlist", data=None)
