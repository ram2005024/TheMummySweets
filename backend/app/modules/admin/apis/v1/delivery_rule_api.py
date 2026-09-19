from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.dependencies.permission import RolePermission
from app.modules.admin.dependencies.get_service_factories import (
    get_delivery_rule_service,
)
from app.modules.admin.schemas.delivery_rule_schema import (
    CreateDeliveryRule,
    ReadDeliveryRule,
    UpdateDeliveryRule,
)
from app.modules.admin.services.delivery_rule_service import DeliveryRuleService
from app.schemas.common import SuccessResponse

delivery_rule_router = APIRouter(
    prefix="/delivery-rule",
    dependencies=[Depends(RolePermission(["admin"]))],
    tags=["Admin Delivery Rule Endpoints"],
)


@delivery_rule_router.post("/", response_model=SuccessResponse[None])
async def create_delivery_rule_endpoint(
    data: CreateDeliveryRule,
    rule_service: Annotated[DeliveryRuleService, Depends(get_delivery_rule_service)],
):
    await rule_service.create_delivery_rule_service(data)
    return SuccessResponse(message="Delivery rule created successfully", data=None)


@delivery_rule_router.get("/", response_model=SuccessResponse[list[ReadDeliveryRule]])
async def get_delivery_rules_endpoint(
    rule_service: Annotated[DeliveryRuleService, Depends(get_delivery_rule_service)],
):
    datas = await rule_service.read_delivery_rule_service()
    return SuccessResponse(message="", data=datas)


@delivery_rule_router.get(
    "/{delivery_rule_id}", response_model=SuccessResponse[ReadDeliveryRule]
)
async def get_delivery_rule_endpoint(
    delivery_rule_id: UUID,
    rule_service: Annotated[DeliveryRuleService, Depends(get_delivery_rule_service)],
):
    data = await rule_service.read_single_delivery_rule(delivery_rule_id)
    return SuccessResponse(message="", data=data)


@delivery_rule_router.patch("/{delivery_rule_id}", response_model=SuccessResponse[None])
async def update_delivery_rule_endpoint(
    delivery_rule_id: UUID,
    rule_service: Annotated[DeliveryRuleService, Depends(get_delivery_rule_service)],
    update_data: UpdateDeliveryRule,
):
    await rule_service.update_delivery_rule(delivery_rule_id, update_data)
    return SuccessResponse(message="Updated successfully", data=None)


@delivery_rule_router.delete(
    "/{delivery_rule_id}", response_model=SuccessResponse[None]
)
async def delete_delivery_rule_endpoint(
    delivery_rule_id: UUID,
    rule_service: Annotated[DeliveryRuleService, Depends(get_delivery_rule_service)],
):
    await rule_service.delete_delivery_rule(delivery_rule_id)
    return SuccessResponse(message="Deleted successfully", data=None)
