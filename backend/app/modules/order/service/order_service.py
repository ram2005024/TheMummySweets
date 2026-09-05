from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.order.order_exception import ProductUnavailable
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.schemas.order_schema import (
    CartItems,
    OrderRequest,
    ProductReadBasic,
)


class OrderService:
    VAT_PERCENT_TO_APPLY = 0.13
    DELIVERY_FEE = 60
    DELIVERY_THRESOLD = 620

    def __init__(self, order_repo: OrderRepo, product_repo: ProductRepo) -> None:
        self.order_repo = order_repo
        self.product_repo = product_repo

    async def create_order(self, data: OrderRequest):
        validated_products: list[dict] = await self.validate_cart_items(data.cart_items)
        calculation_details = self.calculate_product(validated_products)

    async def validate_cart_items(self, items: list[CartItems]):
        items_ids = [item.id for item in items]
        products = await self.product_repo.read_product_with_ids(items_ids)
        product_ids = [product.id for product in products]
        if not all(id in product_ids for id in items_ids) and all(
            product.is_available and product.in_stock for product in products
        ):
            raise ProductUnavailable
        product_info = [
            ProductReadBasic.model_validate(product).model_dump()
            for product in products
        ]
        return product_info

    def calculate_product(self, products: list[dict]):
        sub_total = 0
        for product in products:
            sub_total += product["price"]
        # Later delivery fee according to the location will be implemented here
        has_free_delivery = sub_total > self.DELIVERY_THRESOLD
        total = (
            sub_total
            + self.VAT_PERCENT_TO_APPLY * sub_total
            + (self.DELIVERY_FEE if has_free_delivery else 0)
        )
        return {
            "total": round(total),
            "sub_total": round(sub_total),
            "delivery_fee": "FREE" if has_free_delivery else self.DELIVERY_FEE,
            "vat_amount": round(sub_total * self.VAT_PERCENT_TO_APPLY),
        }
