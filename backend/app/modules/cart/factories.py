from typing import Annotated

from fastapi import Depends
from redis.asyncio import Redis

from app.core.redis import get_redis
from app.modules.cart.cart_services import CartService
from app.modules.menu.dependencies.factories_repo import get_product_repo
from app.modules.menu.repos.product_repo import ProductRepo


def get_cart_service(
    redis: Annotated[Redis, Depends(get_redis)],
    product_repo: Annotated[ProductRepo, Depends(get_product_repo)],
):
    return CartService(redis, product_repo)
