from typing import Annotated

from fastapi import Depends
from redis import Redis
from redis.asyncio import Redis

from app.core.redis import get_redis
from app.modules.menu.dependencies.factories_repo import get_product_repo
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.order.dependencies.repo_factory import (
    get_coupen_repo,
    get_order_repo,
    get_payment_repo,
)
from app.modules.order.repo.coupen_repo import CoupenRepo
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.service.idempotancy_service import IdempotancyService
from app.modules.order.service.order_service import OrderService
from app.modules.order.service.payment_repo import PaymentRepo


def get_order_idempotent_service(redis: Annotated[Redis, Depends(get_redis)]):
    return IdempotancyService(redis)


def get_order_service(
    order_repo: Annotated[OrderRepo, Depends(get_order_repo)],
    product_repo: Annotated[ProductRepo, Depends(get_product_repo)],
    coupen_repo: Annotated[CoupenRepo, Depends(get_coupen_repo)],
    payment_repo: Annotated[PaymentRepo, Depends(get_payment_repo)],
):
    return OrderService(order_repo, product_repo, coupen_repo, payment_repo)
