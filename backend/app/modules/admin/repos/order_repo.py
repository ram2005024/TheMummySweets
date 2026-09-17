from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.menu.models.product_model import Product
from app.modules.order.models.order_item_model import OrderItem
from app.modules.order.models.order_model import OrderModel


class OrderRepoAdmin:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_orders(self):
        query = (
            (
                select(
                    OrderModel,
                    func.coalesce(func.avg(Product.average_preparation_time), 0).label(
                        "avg_preparation_time"
                    ),
                )
                .join(OrderItem, OrderItem.order_id == OrderModel.id)
                .join(Product, Product.id == OrderItem.product_id)
            )
            .options(
                selectinload(OrderModel.order_items).selectinload(OrderItem.product),
                selectinload(OrderModel.user),
                selectinload(OrderModel.delivery),
            )
            .group_by(OrderModel.id)
        )
        result = await self.db.execute(query)
        return result.all()
