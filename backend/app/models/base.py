import uuid
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class BaseModel(Base):
    __abstract__ = True
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), default=func.now(), onupdate=func.now()
    )
