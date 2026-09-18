from typing import Annotated

from fastapi import Depends

from app.modules.admin.services.order_service import OrderServiceAdmin
from app.modules.order.dependencies.repo_factory import get_order_repo
from app.modules.order.repo.order_repo import OrderRepo
from app.services.image_services import ImageService


def get_image_service(service: Annotated[ImageService, Depends()]):
    return service


def get_order_service_admin(
    order_repo_admin: Annotated[OrderRepo, Depends(get_order_repo)],
):
    return OrderServiceAdmin(order_repo_admin)
