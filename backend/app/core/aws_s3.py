import json
import logging

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings

logger = logging.getLogger(__name__)

BUCKET_NAME = "the-mummy-medias"

s3_client = boto3.client(
    "s3",
    endpoint_url=settings.MINIO_ENDPOINT,  # Not required in production (real AWS S3)
    aws_access_key_id=settings.MINIO_ACCESS,  # Replace with real AWS S3 access key
    aws_secret_access_key=settings.MINIO_SECRET,  # Replace with real AWS S3 secret key
    region_name="us-east-1",
)


def build_public_read_policy(bucket_name: str) -> str:
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{bucket_name}/*"],
            }
        ],
    }
    return json.dumps(policy)


def ensure_bucket(bucket_name: str) -> None:
    try:
        s3_client.head_bucket(Bucket=bucket_name)
        logger.info("Bucket '%s' already exists", bucket_name)
    except ClientError as exc:
        error_code = exc.response.get("Error", {}).get("Code", "")
        if error_code in ("404", "NoSuchBucket"):
            s3_client.create_bucket(Bucket=bucket_name)
            logger.info("Created bucket '%s'", bucket_name)
        else:
            logger.error("Failed to check bucket '%s': %s", bucket_name, exc)
            raise

    apply_bucket_policy(bucket_name)


def apply_bucket_policy(bucket_name: str) -> None:
    try:
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=build_public_read_policy(bucket_name),
        )
        logger.info("Applied public-read policy to bucket '%s'", bucket_name)
    except ClientError as exc:
        logger.error("Failed to apply policy to bucket '%s': %s", bucket_name, exc)
        raise


# Ensure the bucket exists and has the correct policy applied
ensure_bucket(BUCKET_NAME)
