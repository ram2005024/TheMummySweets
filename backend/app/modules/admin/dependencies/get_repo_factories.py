from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.admin.repos.delivery_rule_repo import DeliveryRuleRepo


def get_delivery_rule_repo(db: Annotated[AsyncSession, Depends(get_db)]):
    return DeliveryRuleRepo(db)
