



from typing import Annotated

from fastapi import Depends

from app.exceptions.permission_exception import UserNotAllowed
from app.modules.auth.dependencies.user import get_user
from app.modules.auth.models.user import User


class RolePermission:
    def __init__(self,roles:list[str]) -> None:
        self.roles=roles

    def __call__(self,user:Annotated[User,Depends(get_user)]):
        if user.role.value not in self.roles:
            raise UserNotAllowed
        return user
