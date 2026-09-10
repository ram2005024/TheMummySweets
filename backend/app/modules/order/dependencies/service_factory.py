from typing import Annotated

import redis.asyncio as redis
from fastapi import Depends

from app.core.redis import get_redis
from app.modules.cart.cart_services import CartService
from app.modules.cart.factories import get_cart_service
from app.modules.menu.dependencies.factories_repo import get_product_repo
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.order.dependencies.repo_factory import (
    get_coupen_repo,
    get_order_repo,
    get_payment_repo,
)
from app.modules.order.repo.coupen_repo import CoupenRepo
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.repo.payment_repo import PaymentRepo
from app.modules.order.service.idempotancy_service import IdempotancyService
from app.modules.order.service.order_service import OrderService


def get_order_idempotent_service(redis: Annotated[redis.Redis, Depends(get_redis)]):
    return IdempotancyService(redis)


def get_order_service(
    order_repo: Annotated[OrderRepo, Depends(get_order_repo)],
    product_repo: Annotated[ProductRepo, Depends(get_product_repo)],
    coupen_repo: Annotated[CoupenRepo, Depends(get_coupen_repo)],
    payment_repo: Annotated[PaymentRepo, Depends(get_payment_repo)],
    cart_service: Annotated[CartService, Depends(get_cart_service)],
):
    return OrderService(
        order_repo, product_repo, coupen_repo, payment_repo, cart_service
    )
