import stripe
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.exceptions.stripe_exceptions import OrderNotFound, PaymentNotFound
from app.modules.order.repo.order_repo import OrderRepo
from app.repos.stripe_repo import StripeRepo
from app.modules.order.repo.payment_repo import PaymentRepo

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    def __init__(self, db: AsyncSession) -> None:
        self.stripe_repo = StripeRepo(db)
        self.payment_repo = PaymentRepo(db)
        self.order_repo = OrderRepo(db)

    async def handle_webhook_event(self, event):
        # Check the event has already processed
        exists = await self.stripe_repo.get_stripe_event_by_id(event["id"])
        if exists:
            return True
        # Create the event
        await self.stripe_repo.create(event["id"], event["type"])
        # Check the event type
        if event["type"] == "payment_intent.succeeded":
            pass

    async def handle_succeed_event(self, intent_object: dict):
        intent_id = intent_object.get("id", "")
        meta: dict = intent_object.get("meta", {})
        order_id = meta.get("order_id", "")
        payment = await self.payment_repo.get_payment_by_intent_id(intent_id)
        order = await self.order_repo.get_order_by_id(order_id)
        if not payment:
            raise PaymentNotFound
        if not order:
            raise OrderNotFound
