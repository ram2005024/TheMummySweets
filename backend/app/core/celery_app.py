import logging

import sentry_sdk
from celery import Celery
from sentry_sdk.integrations.celery import CeleryIntegration

from app import models  #Noqa
from app.core.config import settings

celery_app=Celery(
    broker=settings.REDIS_BROKER,
    backend=settings.REDIS_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kathmandu",
    enabled_utc=True,
)

celery_app.autodiscover_tasks(["app.tasks"])


logging.basicConfig(
    level=logging.ERROR,
    format="%(asctime)s %(levelname)s %(message)s"
)
# Initialize Sentry
sentry_sdk.init(
    dsn="https://135ed264a3002c80aebffc1f8dea1c9d@o4511752081768448.ingest.us.sentry.io/4511752084520960",
    integrations=[CeleryIntegration()],
    traces_sample_rate=1.0
)
