from typing import Annotated

from fastapi import Depends
from stripe.climate import OrderService

from app.modules.admin.dependencies.get_repo_factories import get_order_repo_admin
from app.modules.order.repo.order_repo import OrderRepo
from app.services.image_services import ImageService


def get_image_service(service: Annotated[ImageService, Depends()]):
    return service


def get_order_service_admin(
    order_repo_admin: Annotated[OrderRepo, Depends(get_order_repo_admin)],
):
    return OrderService(order_repo_admin)
