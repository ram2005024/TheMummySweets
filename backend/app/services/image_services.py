import asyncio
import io
from typing import BinaryIO

import sentry_sdk
from fastapi import UploadFile
from PIL import Image

from app.core.aws_s3 import s3_client
from app.core.config import settings
from app.exceptions.image_exceptions import InvalidImageFormat


class ImageService:
    def __init__(self) -> None:
        self.SIGNATURES = {
            b"\xff\xd8\xff": "jpeg",
            b"\x89\x50\x4e\x47": "png",
        }
        self.BUCKET = "the-mummy-medias"

    async def validate_image(self, file: UploadFile):
        header = await file.read(12)
        await file.seek(0)
        for signature, file_type in self.SIGNATURES.items():
            if header.startswith(signature):
                return file_type
        raise InvalidImageFormat

    async def generate_key(self, size: str, field_id: str, field: str):
        return f"{field}/{field_id}/{size}.jpeg"

    async def _thumbnail(self, image: Image.Image, required_size: int = 400):
        image = image.convert("RGB")
        w, h = image.size
        scale = required_size / min(w, h)
        image = image.resize((int(w * scale), int(h * scale)))
        w_new, h_new = image.size
        left = (w_new - required_size) // 2
        top = (h_new - required_size) // 2
        right = left + required_size
        bottom = top + required_size
        return image.crop((left, top, right, bottom))

    async def _medium(self, image: Image.Image):
        image = image.convert("RGB")
        return image.resize((800, 600))

    async def _originial(self, image: Image.Image):
        return image.convert("RGB")

    def get_public_url(self, key: str):
        return f"{settings.MINIO_ENDPOINT_LOCAL}/{self.BUCKET}/{key}"

    async def upload_image(self, buffer: BinaryIO, key: str):
        await asyncio.to_thread(
            s3_client.upload_fileobj,
            buffer,
            self.BUCKET,
            key,
            ExtraArgs={"ContentType": "image/jpeg"},
        )
        return self.get_public_url(key)

    async def process_image_upload(
        self, file: UploadFile, field_id: str, field_name: str
    ):
        # Verify the image
        await self.validate_image(file)
        raw_bytes = await file.read()
        img = Image.open(io.BytesIO(raw_bytes))
        # Generate the image in different viewport
        thum_task = self._thumbnail(img, 400)
        medium_task = self._medium(img)
        original_task = self._originial(img)
        thumb, medium, original = await asyncio.gather(
            thum_task, medium_task, original_task, return_exceptions=True
        )
        versions = {
            "thumbnail": thumb,
            "medium": medium,
            "original": original,
        }
        urls = {}
        for file_type, original_image in versions.items():
            if isinstance(original_image, Exception):
                print(f"{file_type} upload failed:{original_image}")
                sentry_sdk.capture_exception(original_image)
                urls[file_type] = ""
                continue
            buffer = io.BytesIO()
            quality = 60 if file_type == "thumbnail" else 80
            original_image.save(buffer, format="jpeg", quality=quality, optimize=True)  # type: ignore
            buffer.seek(0)
            key = await self.generate_key(file_type, field_id, field_name)
            url = await self.upload_image(buffer, key)
            urls[file_type] = url
        return urls
