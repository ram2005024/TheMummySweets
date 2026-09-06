from fastapi import FastAPI

from app.api.stripe import stripe_route
from app.modules.admin.apis import v1 as admin_apis_v1
from app.modules.auth.apis import v1 as auth_apis_v1
from app.modules.cart import v1 as cart_api_v1
from app.modules.menu.apis import v1 as menu_apis_v1
from app.modules.order.api import v1 as order_apis_v1


def include_apis(app: FastAPI):
    app.include_router(auth_apis_v1.auth_router, prefix="/api/v1")
    app.include_router(menu_apis_v1.category_api, prefix="/api/v1")
    app.include_router(menu_apis_v1.product_api, prefix="/api/v1")
    app.include_router(menu_apis_v1.wishlist_api, prefix="/api/v1")
    app.include_router(cart_api_v1.cart_api, prefix="/api/v1")
    # Admin router
    app.include_router(admin_apis_v1.image_api, prefix="/api/v1")
    # Order api
    app.include_router(order_apis_v1.order_api, prefix="/api/v1")
    # Stripe route
    app.include_router(stripe_route)
