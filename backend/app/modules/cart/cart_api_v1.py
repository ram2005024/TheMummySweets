from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request

from app.modules.cart.cart_services import CartService
from app.modules.cart.dependencies import (
    verify_product_and_authenticate_user_or_retrieve_guest_id,
)
from app.modules.cart.factories import get_cart_service
from app.schemas.common import SuccessResponse

cart_api = APIRouter(prefix="/cart", tags=["Cart Endpoints"])


# Add cart items
@cart_api.post("/cart/{product_id}", response_model=SuccessResponse[None])
async def add_cart_endpoint(
    request: Request,
    product_id: UUID,
    ids: Annotated[
        tuple, Depends(verify_product_and_authenticate_user_or_retrieve_guest_id)
    ],
    cart_service: Annotated[CartService, Depends(get_cart_service)],
):
    user_id, guest_id = ids
    return await cart_service.add_cart_item(request, product_id, user_id, guest_id)
