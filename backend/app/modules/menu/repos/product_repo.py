from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies.pagination import Pagination
from app.models.image import Image
from app.modules.auth.models.user import User
from app.modules.menu.dependencies.filter_products import FilterProduct
from app.modules.menu.models.category_model import Category
from app.modules.menu.models.product_model import Product
from app.modules.menu.models.relationship_model import wishlist_product
from app.modules.menu.models.review_model import Comment, Review
from app.modules.menu.schemas.product import ProductCreate, ProductReadBasicCustomer
from app.schemas.pagination_schema import PaginatedResponse


class ProductRepo:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

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

    async def read_multiple_products(
        self, filter_data: FilterProduct, pagination_data: Pagination
    ):
        root_stmt = (
            select(
                Product,
                func.count(Review.id).label("review_count"),
                func.coalesce(func.avg(Review.rating), 0).label("rating"),
            )
            .outerjoin(Review, Product.id == Review.product_id)
            .group_by(Product.id)
        )
        filtered_stmt = await filter_data.filter_product(root_stmt)
        total = (
            await self.db.execute(
                select(func.count()).select_from(root_stmt.subquery())
            )
        ).scalar()
        filtered_data = (
            await self.db.execute(
                filtered_stmt.limit(pagination_data.limit).offset(
                    (pagination_data.page - 1) * pagination_data.limit
                )
            )
        ).all()
        filtered_total = (
            await self.db.execute(
                select(func.count()).select_from(filtered_stmt.subquery())
            )
        ).scalar()
        meta = pagination_data.pagination(total or 0, filtered_total or 0)
        data = []
        for product, review_count, rating in filtered_data:
            product_data = ProductReadBasicCustomer.model_validate(product)
            data.append(
                product_data.model_copy(
                    update={
                        "rating": round(rating, 2),
                        "review_count": int(review_count),
                    }
                )
            )
        return PaginatedResponse(meta=meta, data=data)

    async def read_single_product(self, product_id: UUID):
        product = (
            await self.db.execute(
                select(
                    Product,
                    func.count(Review.id).label("review_count"),
                    func.coalesce(func.avg(Review.rating), 0).label("rating"),
                )
                .outerjoin(Review, Product.id == Review.product_id)
                .group_by(Product.id)
                .where(Product.id == product_id)
            )
        ).one_or_none()
        return product

    async def read_product_reviews(self, product_id: UUID, pagination: Pagination):
        base_stmt = (
            select(Review)
            .where(Review.product_id == product_id)
            .options(
                selectinload(Review.user).selectinload(User.profile),
                selectinload(Review.comments)
                .selectinload(Comment.user)
                .selectinload(User.profile),
            )
        )
        total_stmt = select(func.count()).select_from(base_stmt.subquery())
        total_count = (await self.db.execute(total_stmt)).scalar() or 0
        # No filter till now will be added later-----
        filtered_stmt = select(func.count()).select_from(base_stmt.subquery())
        filtered_count = (await self.db.execute(filtered_stmt)).scalar() or 0
        data = (
            (
                await self.db.execute(
                    base_stmt.offset((pagination.page - 1) * pagination.limit).limit(
                        pagination.limit
                    )
                )
            )
            .scalars()
            .all()
        )
        meta = pagination.pagination(total=total_count, filtered_total=filtered_count)
        return PaginatedResponse(meta=meta, data=data)

    async def read_wishlist_products(
        self, filter_data: FilterProduct, pagination_data: Pagination, wishlist_id: UUID
    ):
        root_stmt = (
            select(
                Product,
                func.count(Review.id).label("review_count"),
                func.coalesce(func.avg(Review.rating), 0).label("rating"),
            )
            .join(wishlist_product, wishlist_product.c.product_id == Product.id)
            .outerjoin(Review, Product.id == Review.product_id)
            .where(wishlist_product.c.wishlist_id == wishlist_id)
            .group_by(Product.id)
        )
        filtered_stmt = await filter_data.filter_product(root_stmt)
        total = (
            await self.db.execute(
                select(func.count()).select_from(root_stmt.subquery())
            )
        ).scalar()
        filtered_data = (
            await self.db.execute(
                filtered_stmt.limit(pagination_data.limit).offset(
                    (pagination_data.page - 1) * pagination_data.limit
                )
            )
        ).all()
        filtered_total = (
            await self.db.execute(
                select(func.count()).select_from(filtered_stmt.subquery())
            )
        ).scalar()
        meta = pagination_data.pagination(total or 0, filtered_total or 0)
        data = []
        for product, review_count, rating in filtered_data:
            product_data = ProductReadBasicCustomer.model_validate(product)
            data.append(
                product_data.model_copy(
                    update={
                        "rating": round(rating, 2),
                        "review_count": int(review_count),
                    }
                )
            )
        return PaginatedResponse(meta=meta, data=data)
