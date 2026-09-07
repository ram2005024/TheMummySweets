from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.order.models.payment_model import PaymentModel


class PaymentRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_payment_by_intent_id(self, intent_id: str):
        payment = (
            await self.db.execute(
                select(PaymentModel).where(PaymentModel.payment_intent_id == intent_id)
            )
        ).scalar_one_or_none()
        return payment
