from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.modules.order.models.order_item_model import OrderItem
from app.modules.order.models.order_model import OrderModel


class OrderRepoAdmin:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_orders(self):
        query = select(OrderModel).options(
            selectinload(OrderModel.order_items).joinedload(OrderItem.product),
            joinedload(OrderModel.delivery),
            selectinload(OrderModel.user),
        )
        result = await self.db.execute(query)
        return result.scalars().all()
