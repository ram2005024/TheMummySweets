from typing import Annotated

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.dependencies.permission import RolePermission
from app.modules.admin.schemas.order_schema import ReadOrdersAdmin
from app.modules.auth.models.user import User
from app.schemas.common import SuccessResponse
from app.websocket.dependencies import verify_socket_connection
from app.websocket.manager import manager

admin_order_router = APIRouter(prefix="/admin/order", tags=["Admin Order Endpoints"])


@admin_order_router.websocket("/ws")
async def establish_connection(
    ws: WebSocket, db: Annotated[AsyncSession, Depends(get_db)]
):
    user = await verify_socket_connection(["admin"], ws, db)
    if not user:
        return
    await manager.connect_admin_connection(ws, str(user.id))
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(str(user.id), ws)


@admin_order_router.get("/", response_model=SuccessResponse[list[ReadOrdersAdmin]])
async def get_admin_orders_endpoint(
    user: Annotated[User, Depends(RolePermission(["admin"]))],
):
    pass
