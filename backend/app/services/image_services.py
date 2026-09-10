import asyncio
import io
from typing import BinaryIO

import sentry_sdk
from app.core.aws_s3 import generate_presigned_url, upload_file
from app.core.config import settings
from app.exceptions.image_exceptions import InvalidImageFormat
from fastapi import UploadFile
from PIL import Image


class ImageService:
    def __init__(self) -> None:
        self.SIGNATURES = {
            b"\xff\xd8\xff": "jpeg",
            b"\x89\x50\x4e\x47": "png",
        }
        self.BUCKET = settings.S3_BUCKET_NAME

    async def validate_image(self, file: UploadFile):
        header = await file.read(12)
        await file.seek(0)

        for signature, file_type in self.SIGNATURES.items():
            if header.startswith(signature):
                return file_type

        raise InvalidImageFormat

    async def generate_key(
        self,
        size: str,
        field_id: str,
        field: str,
    ):
        return f"{field}/{field_id}/{size}.jpeg"

    async def _thumbnail(
        self,
        image: Image.Image,
        required_size: int = 400,
    ):
        image = image.convert("RGB")

        width, height = image.size
        scale = required_size / min(width, height)

        image = image.resize(
            (
                int(width * scale),
                int(height * scale),
            )
        )

        width_new, height_new = image.size

        left = (width_new - required_size) // 2
        top = (height_new - required_size) // 2
        right = left + required_size
        bottom = top + required_size

        return image.crop(
            (
                left,
                top,
                right,
                bottom,
            )
        )

    async def _medium(self, image: Image.Image):
        image = image.convert("RGB")
        return image.resize((800, 600))

    async def _original(self, image: Image.Image):
        return image.convert("RGB")

    async def upload_image(
        self,
        buffer: BinaryIO,
        key: str,
    ):
        await asyncio.to_thread(
            upload_file,
            buffer,
            key,
            "image/jpeg",
        )

        return generate_presigned_url(key)

    async def process_image_upload(
        self,
        file: UploadFile,
        field_id: str,
        field_name: str,
    ):
        # Validate image
        await self.validate_image(file)

        # Read original image
        raw_bytes = await file.read()

        img = Image.open(io.BytesIO(raw_bytes))

        # Generate image versions
        thumbnail_task = self._thumbnail(img, 400)
        medium_task = self._medium(img)
        original_task = self._original(img)

        thumbnail, medium, original = await asyncio.gather(
            thumbnail_task,
            medium_task,
            original_task,
            return_exceptions=True,
        )

        versions = {
            "thumbnail": thumbnail,
            "medium": medium,
            "original": original,
        }

        urls = {}

        for file_type, image in versions.items():
            if isinstance(image, Exception):
                sentry_sdk.capture_exception(image)
                urls[file_type] = ""
                continue

            buffer = io.BytesIO()

            quality = 60 if file_type == "thumbnail" else 80

            image.save(
                buffer,
                format="JPEG",
                quality=quality,
                optimize=True,
            )

            buffer.seek(0)

            key = await self.generate_key(
                file_type,
                field_id,
                field_name,
            )

            url = await self.upload_image(
                buffer,
                key,
            )

            urls[file_type] = url

        return urls
