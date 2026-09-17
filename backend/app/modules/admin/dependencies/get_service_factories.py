from typing import Annotated

from fastapi import Depends

from app.modules.admin.dependencies.get_repo_factories import get_order_repo_admin
from app.modules.admin.repos.order_repo import OrderRepoAdmin
from app.modules.admin.services.order_service import OrderServiceAdmin
from app.services.image_services import ImageService


def get_image_service(service: Annotated[ImageService, Depends()]):
    return service


def get_order_service_admin(
    order_repo_admin: Annotated[OrderRepoAdmin, Depends(get_order_repo_admin)],
):
    return OrderServiceAdmin(order_repo_admin)
