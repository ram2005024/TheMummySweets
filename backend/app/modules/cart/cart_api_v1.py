from typing import Annotated

from fastapi import APIRouter, Depends, Request

from app.modules.cart.cart_schema import CartItemsRead
from app.modules.cart.cart_services import CartService
from app.modules.cart.dependencies import authenticate_user_or_retrieve_guest_id
from app.modules.cart.factories import get_cart_service
from app.modules.menu.dependencies.product_dependencies import check_product
from app.modules.menu.models.product_model import Product
from app.schemas.common import SuccessResponse

cart_api = APIRouter(prefix="/cart", tags=["Cart Endpoints"])


# Add cart items
@cart_api.post("/cart/{product_id}", response_model=SuccessResponse[None])
async def add_cart_endpoint(
    request: Request,
    product: Annotated[Product, Depends(check_product)],
    ids: Annotated[tuple, Depends(authenticate_user_or_retrieve_guest_id)],
    cart_service: Annotated[CartService, Depends(get_cart_service)],
):
    user_id, guest_id = ids
    return await cart_service.add_cart_item(request, product, user_id, guest_id)


# Get the cart list along with calculation
@cart_api.get("/cart/", response_model=SuccessResponse[CartItemsRead])
async def read_cart_items_endpoint(
    request: Request,
    ids: Annotated[tuple, Depends(authenticate_user_or_retrieve_guest_id)],
    cart_service: Annotated[CartService, Depends(get_cart_service)],
):
    user_id, guest_id = ids
    items = await cart_service.get_cart_details(user_id, guest_id)
    return SuccessResponse(data=items)
