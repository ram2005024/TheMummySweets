from uuid import UUID

from redis.asyncio import Redis

from app.modules.menu.exceptions.product_exceptions import ProductNotFound
from app.modules.menu.repos.product_repo import ProductRepo


class CartService:
    CART_DELIVERY_FEE = 60
    TAX_RATE = 0.13
    CART_TTL = 7  # In days

    def __init__(self, redis: Redis, product_repo: ProductRepo) -> None:
        self.redis = redis
        self.product_repo = product_repo

    def _key(self, user_id: str | None, guest_id: str | None):
        if user_id:
            return f"cart:user:{user_id}"
        else:
            return f"cart:user:{guest_id}"

    async def add_cart_item(
        self, product_id: UUID, user_id: str | None, guest_id: str | None
    ):
        key = self._key(user_id, guest_id)
        price_field = f"{product_id!s}:price"
        name_field = f"{product_id!s}:name"
        quantity = f"{product_id!s}:quantity"

        if not await self.redis.hexists(key, price_field):
            product = await self.product_repo.read_product(product_id)
            if not product:
                raise ProductNotFound
            await self.redis.hset(
                key,
                mapping={
                    price_field: product.total_amount,
                    name_field: product.product_name,
                },
            )
        await self.redis.hincrby(key, quantity)
        await self.redis.expire(key, self.CART_TTL * 24 * 60 * 60)

    async def get_cart_details(self, user_id: str | None, guest_id: str | None):
        items: dict[str, dict] = {}
        key = self._key(user_id, guest_id)
        raw = await self.redis.hgetall(key)
        for field, value in raw.items():
            pid, attr = field.split(":")  # type: ignore
            items.setdefault(pid, {})[attr] = value  # type: ignore
        return await self.get_cart_total_calculation(items)

    async def get_cart_total_calculation(self, value: dict[str, dict]):
        items = {
            "items": [],
            "total": 0,
            "tax_amount": 0,
            "delivery_fee": 0,
            "sub_total": 0,
        }
        if not value:
            return items
        cart_items = []
        sub_total = 0
        for values in value.values():
            sub_total += values["quantity"] * value["price"]
            cart_items.append(values)
        tax_amount = self.TAX_RATE * sub_total
        delivery_fee = 0  # We will calculate
        items["items"] = cart_items
        items["delivery_fee"] = self.CART_DELIVERY_FEE
        items["sub_total"] = sub_total
        items["total"] = sub_total + delivery_fee + tax_amount
        items["tax_amount"] = tax_amount
        return items
