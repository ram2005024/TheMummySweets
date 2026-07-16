from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

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
        print("Database connection started")
        try:
            yield db
            print("DB session closed")
        except Exception:
            await db.rollback()
        finally:
            await db.close()
