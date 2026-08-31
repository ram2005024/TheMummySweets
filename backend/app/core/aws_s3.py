import boto3

from app.core.config import settings

s3_client = boto3.client(
    "s3",
    endpoint_url=settings.MINIO_ENDPOINT,  # In production not required
    aws_access_key_id=settings.MINIO_ACCESS,  # Replace with real aws_s3 access
    aws_secret_access_key=settings.MINIO_SECRET,  # Replace with real aws_s3 secret
    region_name="us-east-1",
)
