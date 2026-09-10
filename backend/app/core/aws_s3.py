import logging

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings

logger = logging.getLogger(__name__)

BUCKET_NAME = settings.S3_BUCKET_NAME

s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
)


def upload_file(
    file_obj,
    object_name: str,
    content_type: str | None = None,
) -> str:
    extra_args = {}

    if content_type:
        extra_args["ContentType"] = content_type

    try:
        s3_client.upload_fileobj(
            file_obj,
            BUCKET_NAME,
            object_name,
            ExtraArgs=extra_args,
        )

        return object_name

    except ClientError:
        logger.exception(
            "Failed to upload '%s' to bucket '%s'",
            object_name,
            BUCKET_NAME,
        )
        raise


def delete_file(object_name: str) -> None:
    try:
        s3_client.delete_object(
            Bucket=BUCKET_NAME,
            Key=object_name,
        )

    except ClientError:
        logger.exception(
            "Failed to delete '%s' from bucket '%s'",
            object_name,
            BUCKET_NAME,
        )
        raise


def generate_presigned_url(
    object_name: str,
    expires_in: int = 3600,
) -> str:
    try:
        return s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": object_name,
            },
            ExpiresIn=expires_in,
        )

    except ClientError:
        logger.exception(
            "Failed to generate presigned URL for '%s'",
            object_name,
        )
        raise
