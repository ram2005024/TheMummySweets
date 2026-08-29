from redis.asyncio import ConnectionPool, Redis

from app.core.config import settings

redis_pool = ConnectionPool.from_url(
    url=settings.REDIS_BACKEND, decode_responses=True, max_connections=20
)


async def get_redis() -> Redis:
    return Redis(connection_pool=redis_pool)


redis = Redis(connection_pool=redis_pool)
