# For user and coupen to track the coupen used user


from sqlalchemy import Column, ForeignKey, Table

from app.core.db import Base

coupen_used_users = Table(
    "coupen_used_users",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("coupen_id", ForeignKey("coupens.id", ondelete="CASCADE"), primary_key=True),
)
# Coupen Valid user relation
coupen_valid_users = Table(
    "coupen_valid_users",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("coupen_id", ForeignKey("coupens.id", ondelete="CASCADE"), primary_key=True),
)
