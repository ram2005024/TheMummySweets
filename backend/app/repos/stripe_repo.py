from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.stripe_event import StripeEvent


class StripeRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_stripe_event_by_id(self, id: str):
        event = (
            await self.db.execute(select(StripeEvent).where(StripeEvent.event_id == id))
        ).scalar_one_or_none()
        return event

    async def create(
        self, event_id: str, event_type: str, payment_intent_id: str | None = None
    ):
        event = StripeEvent(
            event_id=event_id,
            event_type=event_type,
            payment_intent_id=payment_intent_id,
        )
        self.db.add(event)
        await self.db.flush()

    async def commit(self):
        await self.db.commit()
