import json
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.dependencies.permission import RolePermission
from app.modules.auth.models.user import User
from app.modules.order.dependencies.service_factory import (
    get_order_idempotent_service,
    get_order_service,
)
from app.modules.order.models.order_model import OrderStatus
from app.modules.order.order_exception import (
    OrderIdempotancyKeyMissing,
    OrderIsAlreadyProcessing,
)
from app.modules.order.schemas.order_schema import (
    OrderRequest,
    OrderResponse,
)
from app.modules.order.service.idempotancy_service import IdempotancyService
from app.modules.order.service.order_service import OrderService
from app.schemas.common import SuccessResponse
from app.websocket.dependencies import verify_socket_connection
from app.websocket.user_ws_manager import user_manager

order_api = APIRouter(prefix="/order", tags=["Order Endpoints"])


# Create the order web socket for live track
@order_api.websocket("/ws/track")
async def order_track_websocket(
    ws: WebSocket, db: Annotated[AsyncSession, Depends(get_db)]
):
    user = await verify_socket_connection(["admin", "member"], ws, db)
    if not user:
        return
    await user_manager.connect_user(str(user.id), ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        await user_manager.disconnect(str(user.id), ws)


# Create order_endpoint
@order_api.post("/", response_model=SuccessResponse[OrderResponse])
async def order_endpoint(
    user: Annotated[User, Depends(RolePermission(["admin", "member"]))],
    order_service: Annotated[OrderService, Depends(get_order_service)],
    request: Request,
    order_idempotancy: Annotated[
        IdempotancyService, Depends(get_order_idempotent_service)
    ],
    data: OrderRequest,
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


@order_api.get("/status/{order_id}", response_model=SuccessResponse[OrderStatus])
async def order_payment_status(
    user: Annotated[User, Depends(RolePermission(["admin", "member"]))],
    order_service: Annotated[OrderService, Depends(get_order_service)],
    order_id: UUID,
):
    order_status = await order_service.find_order_status(str(order_id))
    return SuccessResponse(data=order_status)
