from fastapi import WebSocket
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import Auth
from app.modules.auth.models.user import User


async def get_socket_user(socket: WebSocket, db: AsyncSession):
    access_token = socket.headers.get("access", None)
    if not access_token:
        return
    payload = Auth().verify_token(access_token)
    user_id = payload.get("user_id", None)
    if not user_id:
        return
    user = (
        await db.execute(select(User).where(User.id == user_id))
    ).scalar_one_or_none()
    if not user:
        return
    return user


async def verify_socket_connection(
    roles: list[str],
    socket: WebSocket,
    db: AsyncSession,
):
    user = await get_socket_user(socket, db)
    if not user or user.role not in roles:
        await socket.close(1008)
        return None
    return user
