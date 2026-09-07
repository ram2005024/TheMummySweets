from typing import Annotated

from fastapi import Depends

from app.dependencies.get_repo_factories import get_stripe_repo
from app.modules.order.dependencies.repo_factory import get_order_repo, get_payment_repo
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.repo.payment_repo import PaymentRepo
from app.repos.stripe_repo import StripeRepo
from app.services.stripe_service import StripeService


def get_stripe_service(
    stripe_repo: Annotated[StripeRepo, Depends(get_stripe_repo)],
    payment_repo: Annotated[PaymentRepo, Depends(get_payment_repo)],
    order_repo: Annotated[OrderRepo, Depends(get_order_repo)],
):
    return StripeService(stripe_repo, payment_repo, order_repo)
