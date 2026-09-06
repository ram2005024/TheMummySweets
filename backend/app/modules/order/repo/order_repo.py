from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.cart.cart_schema import CartItemBasic
from app.modules.order.models.order_item_model import OrderItem
from app.modules.order.models.order_model import OrderModel
from app.modules.order.schemas.order_schema import OrderCreate


class OrderRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, data: OrderCreate):
        order = OrderModel(
            order_status=data.order_status,
            profile_id=data.profile_id,
            payment_id=data.payment_id,
        )
        self.db.add(order)
        await self.db.flush(order)
        return order

    async def create_order_items(self, items: list[CartItemBasic], order: OrderModel):
        for item in items:
            order_item = OrderItem(
                product_id=item.id,
                quantity=item.quantity,
                price=item.price,
                order_id=order.id,
            )
            self.db.add(order_item)
        await self.db.commit()
