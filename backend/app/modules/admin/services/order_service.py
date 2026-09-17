from app.modules.admin.repos.order_repo import OrderRepoAdmin


class OrderServiceAdmin:
    def __init__(self, order_repo: OrderRepoAdmin) -> None:
        self.order_repo = order_repo

    async def get_order_admin(self):
        orders = await self.order_repo.get_orders()
