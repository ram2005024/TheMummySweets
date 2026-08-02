

from app.modules.menu.repos.category_repo import CategoryRepo
from app.modules.menu.schemas.category import CreateCategory
from app.schemas.common import SuccessResponse


class CategoryService:
    def __init__(self,category_repo:CategoryRepo) -> None:
        self.category_repo=category_repo
    # Services
    # Create new category service
    async def create_category(self,data:CreateCategory):
        new=await self.category_repo.create(data)
        if new:
            return SuccessResponse(message="Category created",data=None)
