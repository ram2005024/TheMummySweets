from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.menu.repos.category_repo import CategoryRepo
from app.modules.menu.repos.product_repo import ProductRepo


def get_category_repo(db:Annotated[AsyncSession,Depends(get_db)]):
    return CategoryRepo(db)

def get_product_repo(db:Annotated[AsyncSession,Depends(get_db)]):
    return ProductRepo(db)
