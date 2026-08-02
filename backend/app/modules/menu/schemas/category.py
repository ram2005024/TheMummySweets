

from pydantic import BaseModel


class CreateCategory(BaseModel):
    category_name:str
