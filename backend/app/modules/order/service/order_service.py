from app.modules.auth.models.user import User
from app.modules.menu.models.product_model import Product
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.order.models.order_model import OrderStatus
from app.modules.order.models.payment_model import PaymentStatus
from app.modules.order.order_exception import (
    CoupenUnavailable,
    InvalidCoupen,
    LimitedProductStock,
    ProductUnavailable,
)
from app.modules.order.repo.coupen_repo import CoupenRepo
from app.modules.order.repo.order_repo import OrderRepo
from app.modules.order.schemas.delivery_schema import DeliveryCreate, DeliveryReadBasic
from app.modules.order.schemas.order_schema import (
    CartItems,
    OrderCreate,
    OrderItemBasic,
    OrderRequest,
    OrderResponse,
    ProductCalculation,
    ProductReadWithCartValue,
)
from app.modules.order.service.payment_repo import PaymentRepo
from app.services.stripe_service import stripe


class OrderService:
    VAT_PERCENT_TO_APPLY = 0.13
    DELIVERY_FEE = 60
    DELIVERY_THRESOLD = 620

    def __init__(
        self,
        order_repo: OrderRepo,
        product_repo: ProductRepo,
        coupen_repo: CoupenRepo,
        payment_repo: PaymentRepo,
    ) -> None:
        self.order_repo = order_repo
        self.product_repo = product_repo
        self.coupen_repo = coupen_repo
        self.payment_repo = payment_repo

    async def create_order(self, data: OrderRequest, user: User):
        validated_products = await self.validate_cart_items(data.cart_items)
        calculation_details = await self.calculate_product(
            validated_products, user, data.applied_coupen
        )
        if data.payment_method.value == "stripe":
            response = await self.create_order_for_stripe(
                validated_products, calculation_details, data, user
            )
        await self.order_repo.commit()
        return response

    async def validate_cart_items(self, items: list[CartItems]):
        items_ids = [item.id for item in items]
        products = await self.product_repo.read_product_with_ids(items_ids)
        product_ids = [product.id for product in products]

        if not all(id in product_ids for id in items_ids) and all(
            product.is_available and product.in_stock for product in products
        ):
            raise ProductUnavailable
        product_map = {str(product.id): product for product in products}
        for item in items:
            item_product = product_map[str(item.id)]
            if item.quantity > item_product.stock_quantity:
                raise LimitedProductStock
        product_info = [
            ProductReadWithCartValue.model_validate(
                {
                    **product.__dict__,
                    "quantity": self.find_product_quantity(items, product),
                }
            )
            for product in products
        ]
        return product_info

    def find_product_quantity(self, items: list[CartItems], product: Product):
        quantity = next((item.quantity for item in items if item.id == product.id), 0)
        return quantity

    async def calculate_product(
        self,
        products: list[ProductReadWithCartValue],
        user: User,
        coupen_code: str | None,
    ):
        sub_total = 0
        for product in products:
            sub_total += product.price * product.quantity
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
        self,
        products: list[ProductReadWithCartValue],
        calculation_details: ProductCalculation,
        data: OrderRequest,
        user: User,
    ):
        coupen = None
        if data.applied_coupen:
            coupen = await self.coupen_repo.has_coupen(data.applied_coupen)
        payment = await self.payment_repo.create(
            calculation_details.total,
            user.profile.id,
            coupen.id if coupen else None,
            data.payment_method.name,
        )
        order = await self.order_repo.create(
            OrderCreate(
                payment_id=payment.id,
                profile_id=user.profile.id,
                order_status=OrderStatus.PENDING_PAYMENT,
            )
        )
        delivery_details = await self.order_repo.create_delivery(
            DeliveryCreate(**data.delivery_details.model_dump(), order_id=order.id)
        )
        order_items = await self.order_repo.create_order_items(products, order)
        # Create the payment intent for stripe
        payment_intent = stripe.PaymentIntent.create(
            currency="npr",
            amount=calculation_details.total * 100,
            metadata={"order_id": str(order.id), "payment_id": str(payment.id)},
        )
        payment.payment_intent_id = payment_intent.id
        return OrderResponse(
            payment_method=data.payment_method,
            client_secret=payment_intent.client_secret,
            order_id=order.id,
            payment_status=PaymentStatus.PENDING,
            amount=calculation_details.total,
            calculation=calculation_details,
            order_status=OrderStatus.PENDING_PAYMENT,
            order_items=[
                OrderItemBasic.model_validate(order_item) for order_item in order_items
            ],
            delivery_details=DeliveryReadBasic.model_validate(delivery_details),
        )
