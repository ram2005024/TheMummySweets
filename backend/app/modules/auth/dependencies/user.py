
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import Auth
from app.modules.auth.exceptions.auth_exception import (
    MissingToken,
    UserDoesnotExist,
    UserNotAuthenticated,
)
from app.repos.user_repo import UserRepo

# Get the user with token and authenticated
# oauth_scheme=OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
# async def get_user(request:Request,db:Annotated[AsyncSession,Depends(get_db)],token:Annotated[str,Depends(oauth_scheme)]):
#     if not token:
#         raise MissingToken
#     payload=Auth().verify_token(token)
#     user=await UserRepo(db).get_user_by_field("id",payload["user_id"])
#     if not user:
#         raise UserDoesnotExist
#     if not user.is_authenticated:
#         raise UserNotAuthenticated
#     return user


# For swagger docs testing using the cookie
# Get the user with token and authenticated

async def get_user(request:Request,db:Annotated[AsyncSession,Depends(get_db)]):
    token=request.cookies.get("refresh")
    if not token:
        raise MissingToken
    payload=Auth().verify_token(token)
    user=await UserRepo(db).get_user_by_field("id",payload["user_id"])
    if not user:
        raise UserDoesnotExist
    if not user.is_authenticated:
        raise UserNotAuthenticated
    return user

