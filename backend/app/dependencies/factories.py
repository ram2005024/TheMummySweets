from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.repos.user_repo import UserRepo
from app.services.auth_service import AuthService


# Get Repo factory
def get_user_repo(db: AsyncSession = Depends(get_db)):
    return UserRepo(db)


# Get Service factory
def get_auth_service(repo: UserRepo = Depends(get_user_repo)):
    return AuthService(repo)
