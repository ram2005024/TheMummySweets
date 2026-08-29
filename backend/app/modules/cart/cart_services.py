from uuid import UUID

from fastapi import Request
from fastapi.responses import JSONResponse
from redis.asyncio import Redis

from app.core.config import settings
from app.modules.cart.cart_exceptions import CartAttributesMissing
from app.modules.menu.models.product_model import Product
from app.modules.menu.repos.product_repo import ProductRepo
from app.schemas.common import SuccessResponse


class CartService:
    CART_DELIVERY_FEE = 60
    TAX_RATE = 0.13
    CART_TTL_USER = 7  # In days
    CART_TTL_GUEST = 2  # In hours

    def __init__(self, redis: Redis, product_repo: ProductRepo) -> None:
        self.redis = redis
        self.product_repo = product_repo

    def _key(self, user_id: str | None, guest_id: str | None):
        if user_id:
            return f"cart:user:{user_id}"
        else:
            return f"cart:user:{guest_id}"

    async def add_cart_item(
        self,
        request: Request,
        product: Product,
        user_id: str | None = None,
        guest_id: str | None = None,
    ):
        product_id = product.id
        key = self._key(user_id, guest_id)
        price_field = f"{product_id!s}:price"
        name_field = f"{product_id!s}:name"
        quantity = f"{product_id!s}:quantity"
        main_image = f"{product_id!s}:main_image"
        quantized_unit = f"{product_id!s}:quantized_unit"

        if not await self.redis.hexists(key, price_field):
            await self.redis.hset(
                key,
                mapping={
                    price_field: product.total_amount,
                    name_field: product.product_name,
                    main_image: product.main_image,
                    quantized_unit: product.grouped_unit,
                },
            )
        await self.redis.hincrby(key, quantity)
        expire = (
            self.CART_TTL_GUEST * 60 * 60
            if guest_id
            else self.CART_TTL_USER * 24 * 60 * 60
        )
        await self.redis.expire(key, expire)
        response = JSONResponse(
            status_code=200,
            content=SuccessResponse(
                data=None, message="Item added into cart"
            ).model_dump(),
        )
        if guest_id and not request.cookies.get("guest-session-id"):
            response.set_cookie(
                key="guest-session-id",
                value=guest_id,
                samesite=settings.SAMESITE,
                httponly=True,
                max_age=2 * 60 * 60,
                secure=settings.SECURE,
            )
        return response

    async def get_cart_details(
        self, user_id: str | None = None, guest_id: str | None = None
    ):
        items: dict[str, dict] = {}
        key = self._key(user_id, guest_id)
        raw = await self.redis.hgetall(key)
        valid_attrs = ["name", "price", "quantity", "main_image", "quantized_unit"]
        for field, value in raw.items():
            pid, attr = field.split(":")  # type: ignore
            items.setdefault(pid, {})[attr] = value  # type: ignore
        for pid, cart_items in items.items():
            attrs = cart_items.keys()
            for key in attrs:
                if key not in valid_attrs:
                    raise CartAttributesMissing
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
        for id, items in value.items():
            sub_total += int(items["quantity"]) * float(items["price"])
            items["id"] = UUID(id)
            cart_items.append(items)
        print(cart_items)
        tax_amount = self.TAX_RATE * sub_total
        delivery_fee = self.CART_DELIVERY_FEE  # We will calculate
        items["items"] = cart_items
        items["delivery_fee"] = delivery_fee
        items["sub_total"] = round(sub_total, 2)
        items["total"] = round(sub_total + delivery_fee + tax_amount, 2)
        items["tax_amount"] = round(tax_amount, 2)
        return items

    async def merge_cart_user(self, user_id: UUID, guest_id: str):
        # Get all cart items of the guest
        guest_key = self._key(None, guest_id)
        user_key = self._key(str(user_id), None)
        guest_raw = await self.redis.hgetall(guest_key)
        user_raw = await self.redis.hgetall(user_key)
        if not guest_raw and not user_raw:
            return
        existing_cart_ids = [val.split(":")[0] for val in user_raw]  # type: ignore
        for field, value in guest_raw.items():
            pid, attr = field.split(":")  # type: ignore
            if attr != "quantity":
                continue
            quantity_field = f"{pid}:quantity"
            existing = pid in existing_cart_ids
            if existing:
                user_cart_item_quantity = (
                    await self.redis.hget(user_key, quantity_field) or 0
                )
                await self.redis.hset(
                    user_key,
                    quantity_field,
                    max(int(user_cart_item_quantity), int(value)),
                )
            else:
                await self.add_cart_item(pid, str(user_id), None)  # type: ignore
        await self.redis.delete(guest_key)
        await self.redis.expire(user_key, self.CART_TTL_USER * 24 * 60 * 60)
