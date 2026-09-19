from typing import Annotated

from fastapi import Depends

from app.modules.admin.dependencies.get_repo_factories import get_delivery_rule_repo
from app.modules.admin.repos.delivery_rule_repo import DeliveryRuleRepo
from app.modules.admin.services.delivery_rule_service import DeliveryRuleService
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


def get_delivery_rule_service(
    rule_repo: Annotated[DeliveryRuleRepo, Depends(get_delivery_rule_repo)],
):
    return DeliveryRuleService(rule_repo)
