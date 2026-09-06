from fastapi import APIRouter

from app.services.stripe_service import stripe

stripe_route = APIRouter(prefix="/stripe", tags=["Stripe Endpoints"])


@stripe_route.post("/test-payment")
async def check_stripe():
    payment_intent = stripe.PaymentIntent.create(amount=150000, currency="npr")
    print(payment_intent)
