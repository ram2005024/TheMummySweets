import stripe

from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    def __init__(self) -> None:
        pass
