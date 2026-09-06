import json
from typing import Annotated

from fastapi import APIRouter, Depends, Request

from app.dependencies.permission import RolePermission
from app.modules.auth.models.user import User
from app.modules.order.dependencies.service_factory import (
    get_order_idempotent_service,
    get_order_service,
)
from app.modules.order.order_exception import (
    OrderIdempotancyKeyMissing,
    OrderIsAlreadyProcessing,
)
from app.modules.order.schemas.order_schema import OrderRequest, OrderResponse
from app.modules.order.service.idempotancy_service import IdempotancyService
from app.modules.order.service.order_service import OrderService
from app.schemas.common import SuccessResponse

order_api = APIRouter(prefix="/order", tags=["Order Endpoints"])


# Create order_endpoint
@order_api.post("/", response_model=SuccessResponse[OrderResponse])
async def order_endpoint(
    user: Annotated[User, Depends(RolePermission(["admin", "member"]))],
    data: OrderRequest,
    order_service: Annotated[OrderService, Depends(get_order_service)],
    request: Request,
    order_idempotancy: Annotated[
        IdempotancyService, Depends(get_order_idempotent_service)
    ],
):
    try:
        idemp_key = request.headers.get("x-order-idempotancy-key", None)
        if not idemp_key:
            raise OrderIdempotancyKeyMissing
        is_processing = await order_idempotancy.is_processing(idemp_key)
        if is_processing:
            raise OrderIsAlreadyProcessing
        has_response = await order_idempotancy.get_key_value(idemp_key)
        if has_response:
            return SuccessResponse(
                data=json.loads(has_response), message="Ordered successfully"
            )
        response = await order_service.create_order(data, user)
        await order_idempotancy.set_response(response, idemp_key)
    finally:
        if idemp_key is not None:
            await order_idempotancy.unlock_key(idemp_key)
    return SuccessResponse(data=response, message="Order created successfully")
