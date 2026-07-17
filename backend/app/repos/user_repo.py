from sqlalchemy.ext.asyncio import AsyncSession


class UserRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    # User repos
