import stripe

from app.core.config import settings
from app.exceptions.stripe_exceptions import (
    AmountMismatched,
    OrderNotFound,
    PaymentNotFound,
)
from app.modules.order.models.order_model import OrderStatus
from app.modules.order.models.payment_model import PaymentStatus
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.repo.payment_repo import PaymentRepo
from app.repos.stripe_repo import StripeRepo

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    def __init__(
        self, stripe_repo: StripeRepo, payment_repo: PaymentRepo, order_repo: OrderRepo
    ) -> None:
        self.stripe_repo = stripe_repo
        self.payment_repo = payment_repo
        self.order_repo = order_repo

    async def handle_webhook_event(self, event):
        # Check the event has already processed
        exists = await self.stripe_repo.get_stripe_event_by_id(event["id"])
        if exists:
            return
        # Create the event
        await self.stripe_repo.create(event["id"], event["type"])
        # Check the event type
        intent_obj = event["data"]["object"].to_dict()
        if event["type"] == "payment_intent.succeeded":
            await self.handle_succeed_event(intent_obj)
        elif event["type"] == "payment_intent.payment_failed":
            await self.handle_failed_event(intent_obj)
        await self.stripe_repo.commit()
        return

    async def handle_succeed_event(self, intent_object: dict):
        intent_id = intent_object.get("id", "")
        meta: dict = intent_object.get("metadata", {})
        order_id = meta.get("order_id", "")
        payment = await self.payment_repo.get_payment_by_intent_id(intent_id)
        order = await self.order_repo.get_order_by_id(order_id)
        if not payment:
            raise PaymentNotFound
        if not order:
            raise OrderNotFound
        paid_amount = intent_object.get("amount", 0) / 100
        payment_amount = round(payment.amount)
        if paid_amount != payment_amount:
            raise AmountMismatched
        payment.payment_status = PaymentStatus.PAID
        order.order_status = OrderStatus.PLACED

    async def handle_failed_event(self, intent_object: dict):
        intent_id = intent_object.get("id", "")
        meta: dict = intent_object.get("metadata", {})
        order_id = meta.get("order_id", "")
        payment = await self.payment_repo.get_payment_by_intent_id(intent_id)
        order = await self.order_repo.get_order_by_id(order_id)
        if not payment:
            raise PaymentNotFound
        if not order:
            raise OrderNotFound
        payment.payment_status = PaymentStatus.FAILED
        order.order_status = OrderStatus.CANCELED
