import redis.asyncio as redis

from app.modules.order.schemas.order_schema import OrderResponse


class IdempotancyService:
    TTL = 2  # In minutes
    RES_TTL = 1  # In hours
    KEY_PREFIX = "idempotent:order:"

    def __init__(self, redis: redis.Redis) -> None:
        self.redis = redis

    def _key(self, idemp_key: str):
        return f"{self.KEY_PREFIX}{idemp_key}"

    async def is_processing(self, idemp_key: str):
        key = self._key(idemp_key)
        can_lock = await self.redis.set(key, "1", nx=True, ex=self.TTL * 60)
        return can_lock is None

    async def set_response(self, order_response: OrderResponse, idemp_key: str):
        key = self._key(idemp_key)
        return await self.redis.set(
            key, order_response.model_dump_json(), ex=self.RES_TTL * 60 * 60
        )

    async def unlock_key(self, idemp_key: str):
        key = self._key(idemp_key)
        return await self.redis.delete(key)
