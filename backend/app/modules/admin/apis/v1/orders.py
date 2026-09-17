from typing import Annotated

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.websocket.dependencies import verify_socket_connection
from app.websocket.manager import manager

admin_order_router = APIRouter(prefix="/api/v1/admin/order")


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
