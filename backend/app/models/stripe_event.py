from sqlalchemy.orm import Mapped, mapped_column

from app.modules.auth.models.base import BaseModel


class StripeEvent(BaseModel):
    event_id: Mapped[str] = mapped_column(unique=True)
    event_type: Mapped[str]
    payment_intent_id: Mapped[str] = mapped_column(unique=True)
