from typing import Annotated

from fastapi import APIRouter, Depends, Header, Request

from app.core.config import settings
from app.dependencies.get_service_factories import get_stripe_service
from app.exceptions.stripe_exceptions import (
    InvalidSignature,
    MissingSignature,
)
from app.services.stripe_service import StripeService, stripe

stripe_route = APIRouter(prefix="/stripe", tags=["Stripe Endpoints"])


@stripe_route.post("/webhook")
async def check_stripe(
    webhook_service: Annotated[StripeService, Depends(get_stripe_service)],
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
        print("Invalid payload")

    except stripe.SignatureVerificationError:
        raise InvalidSignature

    await webhook_service.handle_webhook_event(event)
    return {"received": True}
