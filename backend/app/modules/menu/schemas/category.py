from uuid import UUID

from pydantic import BaseModel


class CreateCategory(BaseModel):
    category_name: str


class CategoryReadBasic(BaseModel):
    id: UUID
    category_name: str
