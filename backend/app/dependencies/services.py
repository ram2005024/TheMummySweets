from typing import Annotated

from fastapi import Depends

from app.dependencies.repo import get_session_repo, get_user_repo
from app.repos.session_repo import SessionRepo
from app.repos.user_repo import UserRepo
from app.services.auth.auth_service import AuthService


# Get Service factory
def get_auth_service(repo: Annotated[UserRepo ,Depends(get_user_repo)],session_repo:Annotated[SessionRepo ,Depends(get_session_repo)]):
    return AuthService(repo,session_repo)
