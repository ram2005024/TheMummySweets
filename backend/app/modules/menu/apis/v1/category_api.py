from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.permission import RolePermission
from app.modules.auth.models.user import User
from app.modules.menu.dependencies.factories_service import get_category_service
from app.modules.menu.schemas.category import CreateCategory
from app.modules.menu.services.category_services import CategoryService
from app.schemas.common import SuccessResponse

category_api=APIRouter(prefix="/category",tags=["Category Endpoints"])

@category_api.post("/",response_model=SuccessResponse[None])
async def create_category_endpoint(data:CreateCategory,category_service:Annotated[CategoryService,Depends(get_category_service)],user:Annotated[User,Depends(RolePermission(["admin"]))]):
    return await category_service.create_category(data)
