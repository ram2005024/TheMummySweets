from datetime import datetime
from uuid import UUID

import user_agents
from h11 import Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth_sessions import Session


class SessionRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    # Session repos
    async def get_session_by_device_id_user_id(self,device_id:str,user_id:UUID):
        session =(await self.db.execute(select(Session).where(Session.device_id==device_id,Session.user_id==user_id))).scalar_one_or_none()
        return session

    # Create session
    async def create_session(self,request:Request,device_id:str,user_id:UUID,jti:UUID):
        try:
            request_user_agent=request.headers.get("user-agent","unknown") #type:ignore
            ua=user_agents.parse(request_user_agent)

            session=Session(
                user_id=user_id,
                device_id=device_id,
                os=f"{ua.os.family} {ua.os.version_string}",
                browser=f"{ua.browser.family} {ua.browser.version_string}",
                last_login=datetime.now(),
                jti=jti,
                user_agent=request_user_agent
            )
            self.db.add(session)
            await self.db.commit()
            return session
        except Exception as e:
            await self.db.rollback()
            raise e

    # Put the jti into the existing session
    async def put_jti_into_session(self,jti:UUID,session:Session):
        try:
            session.jti=jti
            await self.db.commit()
            return

        except Exception as e:
            await self.db.rollback()
            raise e

    async def get_session_by_id(self,id:str):
        session=(await self.db.execute(select(Session).where(Session.id==UUID(id)))).scalar_one_or_none()
        return session



