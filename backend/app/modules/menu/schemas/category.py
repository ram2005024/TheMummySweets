from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CreateCategory(BaseModel):
    category_name: str


class CategoryReadBasic(BaseModel):
    id: UUID
    category_name: str
    product_count: int

    model_config = ConfigDict(from_attributes=True)
