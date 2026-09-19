from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.admin.models.delivery_rule import DeliveryRule
from app.modules.admin.schemas.delivery_rule_schema import (
    CreateDeliveryRule,
    UpdateDeliveryRule,
)


class DeliveryRuleRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, data: CreateDeliveryRule):
        rule = DeliveryRule()
        for key, value in data.model_dump().items():
            setattr(rule, key, value)
        self.db.add(rule)
        await self.db.commit()

    async def read_multiple(self):
        return (await self.db.execute(select(DeliveryRule))).scalars().all()

    async def read_single(self, rule_id: UUID):
        return (
            await self.db.execute(
                select(DeliveryRule).where(DeliveryRule.id == rule_id)
            )
        ).scalar_one_or_none()

    async def update(self, rule: DeliveryRule, update_data: UpdateDeliveryRule):
        for key, value in update_data.model_dump(exclude_unset=True).items():
            setattr(rule, key, value)
        await self.db.commit()

    async def delete(self, result: DeliveryRule):
        await self.db.delete(result)
        await self.db.commit()
