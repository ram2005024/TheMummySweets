from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import Profile, User


class UserRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    # User repos
    async def get_user_by_field(self,field,value):
        column=getattr(User,field)
        user=(await self.db.execute(select(User).where(column==value))).scalar_one_or_none()
        return user

    async def create_user(self,data:dict):
        user=User()
        for key,value in data.items():
            setattr(user,key,value)
        self.db.add(user)
        await self.db.commit()
        return user

    async def create_profile(self,data:dict):
        profile=Profile()
        for key,value in data.items():
            setattr(profile,key,value)
        self.db.add(profile)
        await self.db.commit()
        return profile



