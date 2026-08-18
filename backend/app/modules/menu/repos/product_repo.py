from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.image import Image
from app.modules.menu.models.category_model import Category
from app.modules.menu.models.product_model import Product
from app.modules.menu.schemas.product import ProductCreate


class ProductRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # Repos
    async def create(self, data: ProductCreate):
        categories = (
            (
                await self.db.execute(
                    select(Category).where(Category.id.in_(data.category_ids))
                )
            )
            .scalars()
            .all()
        )
        if len(categories) != len(data.category_ids):
            raise ValueError("Some categories doesn't exist")
        new_product = Product()
        for key, value in data.model_dump(exclude_unset=True).items():
            if key != "category_ids":
                setattr(new_product, key, value)
        new_product.categories = list(categories)
        self.db.add(new_product)
        await self.db.commit()
        return new_product

    async def find_image_by_hash(self, hash_value):
        return (
            await self.db.execute(select(Image).where(Image.hash_value == hash_value))
        ).scalar_one_or_none()

    async def upload_main_product_image(self, image: str, product_id: UUID):
        product = (
            await self.db.execute(select(Product).where(Product.id == product_id))
        ).scalar_one()
        product.main_image = image
        await self.db.commit()

    async def upload_side_product_images(self, image: list[str], product_id: UUID):
        product = (
            await self.db.execute(select(Product).where(Product.id == product_id))
        ).scalar_one()
        product.side_images = image
        await self.db.commit()
