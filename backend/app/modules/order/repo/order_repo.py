from sqlalchemy.ext.asyncio import AsyncSession


class OrderRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
