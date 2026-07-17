from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Database engine
engine = create_async_engine(settings.ASYNC_DATABASE_URL, echo=True)

# SessionHandler

AsyncSessionHandler = async_sessionmaker(
    bind=engine, autoflush=False, expire_on_commit=False
)

# Base to store the DB tables info
Base = declarative_base()


# Dependency to start the DB session
async def get_db():
    async with AsyncSessionHandler() as db:
        yield db


# Sync Database conf
sync_engine=create_engine(settings.SYNC_DATABASE_URL,echo=True)

# SessionLocal for sync connection
SyncSessionLocal=sessionmaker(bind=sync_engine,autoflush=False,autocommit=False)
