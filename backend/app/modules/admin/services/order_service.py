from app.modules.admin.repos.order_repo import OrderRepoAdmin
from app.modules.admin.schemas.order_schema import ReadOrdersAdmin


class OrderServiceAdmin:
    def __init__(self, order_repo: OrderRepoAdmin) -> None:
        self.order_repo = order_repo

    async def get_order_admin(self):
        values = await self.order_repo.get_orders()
        orders = []
        for order, avg_prep in values:
            validated = ReadOrdersAdmin.model_validate(order)
            validated.average_preparation_time = avg_prep
            orders.append(validated)
        return orders
