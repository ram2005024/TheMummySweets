

from typing import Annotated

from fastapi import Depends

from app.modules.menu.dependencies.factories_repo import (
    get_category_repo,
    get_product_repo,
)
from app.modules.menu.repos.category_repo import CategoryRepo
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.menu.services.category_services import CategoryService
from app.modules.menu.services.product_services import ProductService


def get_category_service(category_repo:Annotated[CategoryRepo,Depends(get_category_repo)]):
    return CategoryService(category_repo)

def get_product_service(repo:Annotated[ProductRepo,Depends(get_product_repo)]):
    return ProductService(repo)
