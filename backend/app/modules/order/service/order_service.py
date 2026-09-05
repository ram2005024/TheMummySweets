from app.modules.order.repo.order_repo import OrderRepo


class OrderService:
    def __init__(self, order_repo: OrderRepo) -> None:
        self.order_repo = order_repo
