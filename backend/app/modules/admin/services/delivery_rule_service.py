from uuid import UUID

from app.modules.admin.exceptions import DeliveryRuleNotFound
from app.modules.admin.repos.delivery_rule_repo import DeliveryRuleRepo
from app.modules.admin.schemas.delivery_rule_schema import (
    CreateDeliveryRule,
    UpdateDeliveryRule,
)


class DeliveryRuleService:
    def __init__(self, delivery_rule_repo: DeliveryRuleRepo) -> None:
        self.delivery_rule_repo = delivery_rule_repo

    async def create_delivery_rule_service(self, data: CreateDeliveryRule):
        await self.delivery_rule_repo.create(data)

    async def read_delivery_rule_service(self):
        data = await self.delivery_rule_repo.read_multiple()
        return data

    async def read_single_delivery_rule(self, rule_id: UUID):
        data = await self.delivery_rule_repo.read_single(rule_id)
        if not data:
            raise DeliveryRuleNotFound
        return data

    async def update_delivery_rule(self, rule_id: UUID, data: UpdateDeliveryRule):
        result = await self.read_single_delivery_rule(rule_id)
        if not result:
            raise DeliveryRuleNotFound
        await self.delivery_rule_repo.update(result, data)

    async def delete_delivery_rule(self, rule_id: UUID):
        result = await self.read_single_delivery_rule(rule_id)
        if not result:
            raise DeliveryRuleNotFound
        await self.delivery_rule_repo.delete(result)
