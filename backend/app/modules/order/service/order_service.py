from app.modules.auth.models.user import User
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.order.order_exception import (
    CoupenUnavailable,
    InvalidCoupen,
    ProductUnavailable,
)
from app.modules.order.repo.coupen_repo import CoupenRepo
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.schemas.order_schema import (
    CartItems,
    OrderRequest,
    ProductCalculation,
    ProductReadBasic,
)


class OrderService:
    VAT_PERCENT_TO_APPLY = 0.13
    DELIVERY_FEE = 60
    DELIVERY_THRESOLD = 620

    def __init__(
        self, order_repo: OrderRepo, product_repo: ProductRepo, coupen_repo: CoupenRepo
    ) -> None:
        self.order_repo = order_repo
        self.product_repo = product_repo
        self.coupen_repo = coupen_repo

    async def create_order(self, data: OrderRequest, user: User):
        validated_products = await self.validate_cart_items(data.cart_items)
        calculation_details = self.calculate_product(
            validated_products, user, data.applied_coupen
        )

    async def validate_cart_items(self, items: list[CartItems]):
        items_ids = [item.id for item in items]
        products = await self.product_repo.read_product_with_ids(items_ids)
        product_ids = [product.id for product in products]
        if not all(id in product_ids for id in items_ids) and all(
            product.is_available and product.in_stock for product in products
        ):
            raise ProductUnavailable
        product_info = [
            ProductReadBasic.model_validate(product) for product in products
        ]
        return product_info

    async def calculate_product(
        self, products: list[ProductReadBasic], user: User, coupen_code: str | None
    ):
        sub_total = 0
        for product in products:
            sub_total += product.price
        # Later delivery fee according to the location will be implemented here
        has_free_delivery = sub_total > self.DELIVERY_THRESOLD
        total = (
            sub_total
            + self.VAT_PERCENT_TO_APPLY * sub_total
            + (self.DELIVERY_FEE if has_free_delivery else 0)
        )
        if coupen_code:
            total = await self.apply_coupen(user, coupen_code, total)
        return ProductCalculation(
            coupen_applied=coupen_code if coupen_code else None,
            delivery_fee="FREE" if has_free_delivery else self.DELIVERY_FEE,
            total=round(total),
            sub_total=round(sub_total),
            vat_amount=round(sub_total * self.VAT_PERCENT_TO_APPLY),
        )

    async def apply_coupen(self, user: User, coupen_code: str, total: float):
        coupen = await self.coupen_repo.has_coupen(coupen_code)
        if not coupen:
            raise InvalidCoupen
        if not await self.coupen_repo.is_coupen_valid_for_user(user, coupen):
            raise InvalidCoupen
        if coupen.required_amount > total or coupen.used_count > coupen.max_use_count:
            raise CoupenUnavailable

        discount_amount = min(
            total * coupen.discount_percentage, coupen.max_discount_amount
        )
        total = total - discount_amount
        return total

    async def create_order_for_stripe(
        self, products: list[ProductReadBasic], calculation_details: ProductCalculation
    ):
        pass
