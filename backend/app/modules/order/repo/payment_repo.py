from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.order.models.payment_model import PaymentModel


class PaymentRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(
        self,
        amount: int,
        profile_id: UUID,
        coupen_id: UUID | None,
        payment_method: str,
    ):
        payment = PaymentModel(
            amount=amount,
            profile_id=profile_id,
            payment_method=payment_method,
            coupen_id=coupen_id,
        )
        self.db.add(payment)
        await self.db.flush()
        return payment

    async def get_payment_by_intent_id(self, intent_id: str):
        payment = (
            await self.db.execute(
                select(PaymentModel).where(PaymentModel.payment_intent_id == intent_id)
            )
        ).scalar_one_or_none()
        return payment

    async def get_payment_by_id(self, payment_id: UUID):
        return (
            await self.db.execute(
                select(PaymentModel).where(PaymentModel.id == payment_id)
            )
        ).scalar_one_or_none()
