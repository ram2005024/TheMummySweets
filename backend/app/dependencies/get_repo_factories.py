from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.repos.stripe_repo import StripeRepo


def get_stripe_repo(db: Annotated[AsyncSession, Depends(get_db)]):
    return StripeRepo(db)
