from pydantic import BaseModel


class ImageResponse(BaseModel):
    thumbnail: str
    original: str
    medium: str
