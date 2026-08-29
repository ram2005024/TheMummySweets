from uuid import uuid4

from fastapi import Depends, Request

from app.core.db import get_db
from app.modules.auth.dependencies.user import get_user
from app.modules.auth.exceptions.auth_exception import MissingToken


async def authenticate_user_or_retrieve_guest_id(request: Request):
    try:
        user = await get_user(request, db=Depends(get_db))
        return user.id, None
    except MissingToken:
        guest_id = request.cookies.get("guest-session-id")
        if not guest_id:
            guest_id = uuid4()
        return None, guest_id
