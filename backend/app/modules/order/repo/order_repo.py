from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.order.models.delivery_details import DeliveryDetails
from app.modules.order.models.order_item_model import OrderItem
from app.modules.order.models.order_model import OrderModel
from app.modules.order.schemas.delivery_schema import DeliveryCreate
from app.modules.order.schemas.order_schema import OrderCreate, ProductReadWithCartValue


class OrderRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def commit(self):
        await self.db.commit()

    async def create(self, data: OrderCreate):
        order = OrderModel(
            order_status=data.order_status,
            profile_id=data.profile_id,
            payment_id=data.payment_id,
        )
        self.db.add(order)
        await self.db.flush()
        return order

    async def create_order_items(
        self, items: list[ProductReadWithCartValue], order: OrderModel
    ):
        order_items: list[OrderItem] = []
        for item in items:
            order_item = OrderItem(
                product_id=item.id,
                quantity=item.quantity,
                price=item.price,
                order_id=order.id,
            )
            self.db.add(order_item)
            await self.db.flush()
            await self.db.refresh(order_item, attribute_names=["product"])
            order_items.append(order_item)
        return order_items

    async def create_delivery(self, data: DeliveryCreate):
        delivery = DeliveryDetails()
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(delivery, key, value)
        self.db.add(delivery)
        await self.db.flush()
        return delivery
