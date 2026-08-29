from typing import Annotated
from uuid import UUID, uuid4

from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.auth.dependencies.user import get_user
from app.modules.auth.exceptions.auth_exception import MissingToken
from app.modules.menu.exceptions.product_exceptions import ProductNotFound
from app.modules.menu.models.product_model import Product


async def verify_product_and_authenticate_user_or_retrieve_guest_id(
    request: Request, product_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]
):
    product = (
        await db.execute(select(Product).where(Product.id == product_id))
    ).scalar_one_or_none()
    if not product:
        raise ProductNotFound
    try:
        user = await get_user(request, db)
        return user.id, None
    except MissingToken:
        guest_id = request.cookies.get("guest-session-id")
        if not guest_id:
            guest_id = uuid4()
        return None, guest_id
