from fastapi import APIRouter, Header, Request

from app.core.config import settings
from app.exceptions.stripe_exceptions import (
    InvalidPayload,
    InvalidSignature,
    MissingSignature,
)
from app.services.stripe_service import stripe

stripe_route = APIRouter(prefix="/stripe", tags=["Stripe Endpoints"])


@stripe_route.post("/webhook")
async def check_stripe(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="stripe-signature"),
):
    if not stripe_signature:
        raise MissingSignature
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=settings.STRIPE_WEBHOOK_SECRET,
        )
    except ValueError:
        raise InvalidPayload

    except stripe.SignatureVerificationError:
        raise InvalidSignature

    print("EventID", event["id"])
    print("EventTYPE", event["type"])
    stripe_object = event["data"]["object"]
    print("Stripe Payment Intent Object:", stripe_object)
    print("PAYMENT INTENT ID:", stripe_object["id"])
    print("AMOUNT:", stripe_object["amount"])
    print("STATUS:", stripe_object["status"])
    print("METADATA:", stripe_object["metadata"])
    return {"received": True}
