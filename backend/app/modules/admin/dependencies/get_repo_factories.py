from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.admin.repos.order_repo import OrderRepoAdmin


def get_order_repo_admin(db: Annotated[AsyncSession, Depends(get_db)]):
    return OrderRepoAdmin(db)
