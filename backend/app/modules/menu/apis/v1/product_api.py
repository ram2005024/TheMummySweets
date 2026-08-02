

from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile

from app.dependencies.permission import RolePermission
from app.modules.auth.models.user import User
from app.modules.menu.dependencies.factories_service import get_product_service
from app.modules.menu.schemas.product import ProductCreate
from app.modules.menu.services.product_services import ProductService
from app.schemas.common import SuccessResponse

product_api=APIRouter(prefix="/product",tags=["Product endpoints v1"])

@product_api.post("/",response_model=SuccessResponse[None])
async def create_product_endpoint(data:Annotated[ProductCreate,Depends(ProductCreate.as_form)],product_service:Annotated[ProductService,Depends(get_product_service)],user:Annotated[User,Depends(RolePermission(["admin"]))],main_image:UploadFile=File(...),side_images:list[UploadFile]=File(None)):  # noqa: B008
    return await product_service.create_product_service(data,main_image,side_images)
