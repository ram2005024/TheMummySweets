from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.order.repo.coupen_repo import CoupenRepo
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.service.payment_repo import PaymentRepo


def get_order_repo(db: Annotated[AsyncSession, Depends(get_db)]):
    return OrderRepo(db)


def get_coupen_repo(db: Annotated[AsyncSession, Depends(get_db)]):
    return CoupenRepo(db)


def get_payment_repo(db: Annotated[AsyncSession, Depends(get_db)]):
    return PaymentRepo(db)
