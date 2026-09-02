from uuid import UUID

from fastapi import UploadFile
from fastapi.responses import JSONResponse

from app.core.security import Auth
from app.dependencies.pagination import Pagination
from app.modules.menu.dependencies.filter_products import FilterProduct
from app.modules.menu.exceptions.product_exceptions import ProductNotFound
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.menu.schemas.product import ProductCreate, ProductReadSingleCustomer
from app.modules.menu.schemas.review import (
    ReadReviewBasic,
    ReviewReadResponse,
    ReviewStats,
)
from app.modules.menu.utils import encode_image
from app.schemas.common import SuccessResponse


class ProductService:
    def __init__(self, product_repo: ProductRepo) -> None:
        self.product_repo = product_repo

    # Services
    async def create_product_service(
        self,
        data: ProductCreate,
    ):
        await self.product_repo.create(data)

        return JSONResponse(
            status_code=200,
            content=SuccessResponse(data=None, message="Product created").model_dump(),
        )

    async def handle_image_upload(
        self,
        main_image: UploadFile,
        product_id: str,
        side_images: list[UploadFile] | None = None,
    ):
        main_image_byte = await main_image.read()
        main_image_hash = Auth().hash_content_with_same_hash(main_image_byte)
        main_image_content = encode_image(main_image_byte)
        # For main image
        image_exist = await self.product_repo.find_image_by_hash(main_image_hash)
        if image_exist:
            await self.product_repo.upload_main_product_image(
                image_exist.url, UUID(product_id)
            )
        else:
            upload_product_main_image.delay(
                main_image_content, main_image_hash, product_id
            )

        # For side images
        already_available_side_images = []
        to_put_side_images = []
        if side_images:
            for image in side_images:
                image_bytes = await image.read()
                encode = encode_image(image_bytes)
                image_hash = Auth().hash_content_with_same_hash(image_bytes)
                exists = await self.product_repo.find_image_by_hash(image_hash)
                if exists:
                    already_available_side_images.append(exists.url)
                else:
                    to_put_side_images.append((image_hash, encode))
        if already_available_side_images:
            await self.product_repo.upload_side_product_images(
                already_available_side_images, UUID(product_id)
            )
        if to_put_side_images:
            upload_product_side_images.delay(to_put_side_images, product_id)

    async def read_all_product_service(
        self, filter_data: FilterProduct, pagination_data: Pagination
    ):
        resp = await self.product_repo.read_multiple_products(
            filter_data, pagination_data
        )
        return SuccessResponse(data=resp)

    async def read_product_by_id(self, product_id: UUID):
        result = await self.product_repo.read_single_product(product_id)
        if result is None:
            raise ProductNotFound
        (product_obj, review_count, rating) = result
        product = ProductReadSingleCustomer.model_validate(product_obj)
        product_final = product.model_copy(
            update={"review_count": review_count, "rating": round(rating, 2)}
        )
        return product_final

    async def generate_distributed_stats(self, product_id: UUID):
        avg, rows = await self.product_repo.rating_count(product_id)
        distributed = {i: 0 for i in range(1, 6)}
        for rating, rating_count in rows:
            distributed[rating] = rating_count
        return ReviewStats(distribution=distributed, avg_rating=float(avg or 0))

    async def read_product_reviews(self, product_id: UUID, pagination: Pagination):
        meta, data = await self.product_repo.read_product_reviews(
            product_id, pagination
        )
        stats = await self.generate_distributed_stats(product_id)
        reviews: list[ReadReviewBasic] = [
            ReadReviewBasic.model_validate(r) for r in data
        ]
        return ReviewReadResponse(meta=meta, data=reviews, stats=stats)
