from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile

from app.dependencies.pagination import Pagination
from app.dependencies.permission import RolePermission
from app.modules.auth.models.user import User
from app.modules.menu.dependencies.factories_service import get_product_service
from app.modules.menu.dependencies.filter_products import FilterProduct
from app.modules.menu.schemas.product import ProductCreate, ProductReadBasicCustomer
from app.modules.menu.services.product_services import ProductService
from app.schemas.common import SuccessResponse
from app.schemas.pagination_schema import PaginatedResponse

product_api = APIRouter(prefix="/product", tags=["Product endpoints v1"])


@product_api.post("/", response_model=SuccessResponse[None])
async def create_product_endpoint(
    data: Annotated[ProductCreate, Depends(ProductCreate.as_form)],
    product_service: Annotated[ProductService, Depends(get_product_service)],
    user: Annotated[User, Depends(RolePermission(["admin"]))],
    main_image: UploadFile = File(...),
    side_images: list[UploadFile] = File(None),
):
    return await product_service.create_product_service(data, main_image, side_images)


# List all the products
@product_api.get(
    "/",
    response_model=SuccessResponse[PaginatedResponse[list[ProductReadBasicCustomer]]],
)
async def read_products_endpoint(
    product_service: Annotated[ProductService, Depends(get_product_service)],
    user: Annotated[User, Depends(RolePermission(["admin", "member"]))],
    filter_data: Annotated[FilterProduct, Depends()],
    pagination_data: Annotated[Pagination, Depends()],
):
    return await product_service.read_all_product_service(filter_data, pagination_data)
