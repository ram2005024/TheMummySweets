from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.schemas.order_schema import OrderRequest


class OrderService:
    def __init__(self, order_repo: OrderRepo) -> None:
        self.order_repo = order_repo

    async def create_order(self, data: OrderRequest):
        pass
