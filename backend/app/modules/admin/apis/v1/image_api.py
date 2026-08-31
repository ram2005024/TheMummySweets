from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, File, UploadFile

from app.modules.admin.dependencies.get_service_factories import get_image_service
from app.modules.admin.schemas.image_schemas import ImageResponse
from app.schemas.common import SuccessResponse
from app.services.image_services import ImageService

image_api = APIRouter(prefix="/admin", tags=["Admin Image Endpoints"])


@image_api.post("/image/upload/product", response_model=SuccessResponse[ImageResponse])
async def upload_product_image_endpoint(
    service: Annotated[ImageService, Depends(get_image_service)],
    file: Annotated[UploadFile, File(...)],
):
    urls = await service.process_image_upload(file, str(uuid4()), "product")
    return SuccessResponse(data=urls)
