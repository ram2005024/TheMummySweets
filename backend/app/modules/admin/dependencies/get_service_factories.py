from typing import Annotated

from fastapi import Depends

from app.services.image_services import ImageService


def get_image_service(service: Annotated[ImageService, Depends()]):
    return service
