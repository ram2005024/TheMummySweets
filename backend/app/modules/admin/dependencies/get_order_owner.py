from typing import Annotated
from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.db import get_db
from app.exceptions.stripe_exceptions import OrderNotFound
from app.modules.admin.exceptions import OrderUserDoesnotExist
from app.modules.auth.models.user import User
from app.modules.order.models.order_model import OrderModel


async def get_order_owner(order_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]):
    order = (
        await db.execute(select(OrderModel).where(OrderModel.id == order_id))
    ).scalar_one_or_none()
    if not order:
        raise OrderNotFound
    user = (
        await db.execute(
            select(User)
            .options(joinedload(User.profile))
            .where(User.profile.id == order.profile_id)
        )
    ).scalar_one_or_none()
    if not user:
        raise OrderUserDoesnotExist
    return user, order
