from typing import Annotated
from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.menu.exceptions.product_exceptions import ProductNotFound
from app.modules.menu.models.product_model import Product


async def check_product(product_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]):
    product = (
        await db.execute(select(Product).where(Product.id == product_id))
    ).scalar_one_or_none()
    if not product:
        return ProductNotFound
    return product
