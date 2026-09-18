from app.modules.admin.schemas.order_schema import ReadOrdersAdmin
from app.modules.auth.models.user import User
from app.modules.order.models.order_model import OrderModel, OrderStatus
from app.modules.order.repo.order_repo import OrderRepo
from app.websocket.user_ws_manager import user_manager


class OrderServiceAdmin:
    def __init__(self, order_repo: OrderRepo) -> None:
        self.order_repo = order_repo

    async def get_order_admin(self):
        values = await self.order_repo.get_orders()
        orders = []
        for order, avg_prep in values:
            validated = ReadOrdersAdmin.model_validate(order)
            validated.average_preparation_time = int(avg_prep)
            orders.append(validated)
        return orders

    async def change_order_status(
        self, order_status: OrderStatus, order: OrderModel, user: User
    ):
        order = await self.order_repo.change_user_order_status(order, order_status)
        await user_manager.broadcast_message(
            str(user.id), {"type": "ORDER_STATUS_CHANGED", "order_id": str(order.id)}
        )
