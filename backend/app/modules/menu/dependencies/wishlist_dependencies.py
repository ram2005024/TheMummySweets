# For the ownership to add the product
from typing import Annotated
from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db
from app.dependencies.permission import RolePermission
from app.modules.auth.models.user import Profile, User
from app.modules.menu.dependencies.product_dependencies import check_product
from app.modules.menu.models.product_model import Product


async def get_user_and_check_product(
    user: Annotated[User, Depends(RolePermission(["member", "admin"]))],
    product_id: UUID,
    product: Annotated[Product, Depends(check_product)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    profile = (
        await db.execute(
            select(Profile)
            .options(selectinload(Profile.wishlist))
            .where(Profile.user_id == user.id)
        )
    ).scalar_one()
    return profile, product
