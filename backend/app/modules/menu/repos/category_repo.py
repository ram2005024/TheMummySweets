from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.menu.models.category_model import Category
from app.modules.menu.models.product_model import Product
from app.modules.menu.schemas.category import CreateCategory


class CategoryRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # Repos
    async def create(self, data: CreateCategory):
        new_category = Category(category_name=data.category_name)
        self.db.add(new_category)
        await self.db.commit()
        return True

    async def list_categories(self):
        categories = (
            await self.db.execute(
                select(Category, func.count(Product.id).label("product_count"))
                .outerjoin(Category.products)
                .group_by(Category.id),
            )
        ).all()
        return categories
