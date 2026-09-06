from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.order.models.payment_model import PaymentMethod, PaymentModel


class PaymentRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(
        self,
        amount: int,
        profile_id: UUID,
        coupen_id: UUID | None,
        payment_method=PaymentMethod,
    ):
        payment = PaymentModel(
            amount=amount,
            profile_id=profile_id,
            payment_method=payment_method,
            coupen_id=coupen_id,
        )
        self.db.add(payment)
        await self.db.flush(payment)
        return payment
