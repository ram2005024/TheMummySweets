


from app.core.celery_app import celery_app
from app.services.notification_service import NotificationService


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_otp(self, otp: str, email: list[str], name: str):
    try:
        result=NotificationService.email_otp(otp, name, email)
        return str(result)
    except Exception as exc:
        raise self.retry(exc=exc)
