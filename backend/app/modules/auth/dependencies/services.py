from typing import Annotated

from fastapi import Depends

from app.modules.auth.dependencies.repo import get_session_repo, get_user_repo
from app.modules.auth.services.auth_service import AuthService
from app.modules.cart.cart_services import CartService
from app.modules.cart.factories import get_cart_service
from app.repos.session_repo import SessionRepo
from app.repos.user_repo import UserRepo


# Get Service factory
def get_auth_service(
    repo: Annotated[UserRepo, Depends(get_user_repo)],
    session_repo: Annotated[SessionRepo, Depends(get_session_repo)],
    cart_service: Annotated[CartService, Depends(get_cart_service)],
):
    return AuthService(repo, session_repo, cart_service)
