from app.modules.admin.repos.order_repo import OrderRepoAdmin
from app.modules.admin.schemas.order_schema import ReadOrdersAdmin


class OrderServiceAdmin:
    def __init__(self, order_repo: OrderRepoAdmin) -> None:
        self.order_repo = order_repo

    async def get_order_admin(self):
        values = await self.order_repo.get_orders()
        orders = [ReadOrdersAdmin.model_validate(order) for order in values]

    async def find_order_avg_prepartion_time(self,order:)
