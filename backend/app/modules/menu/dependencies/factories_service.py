from typing import Annotated

from fastapi import Depends

from app.modules.menu.dependencies.factories_repo import (
    get_category_repo,
    get_product_repo,
    get_wishlist_repo,
)
from app.modules.menu.repos.category_repo import CategoryRepo
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.menu.repos.wishlist_repo import WishlistRepo
from app.modules.menu.services.category_services import CategoryService
from app.modules.menu.services.product_services import ProductService
from app.modules.menu.services.wishlist_service import WishlistService


def get_category_service(
    category_repo: Annotated[CategoryRepo, Depends(get_category_repo)],
):
    return CategoryService(category_repo)


def get_product_service(repo: Annotated[ProductRepo, Depends(get_product_repo)]):
    return ProductService(repo)


def get_wishlist_service(
    wishlist_repo: Annotated[
        WishlistRepo,
        Depends(get_wishlist_repo),
    ],
    product_repo: Annotated[ProductRepo, Depends(get_product_repo)],
):
    return WishlistService(wishlist_repo, product_repo)
