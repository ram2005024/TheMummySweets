



from app.core.celery_app import celery_app
from app.services.notification_service import NotificationService


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_otp(self, otp: str,source:str,value:list[str], name: str):
    try:
        if source=="email":
            result=NotificationService.email_otp(otp, name, value)
        else:
            result=NotificationService.send_sms_otp(value[0],otp,name)
        return str(result)
    except Exception as exc:
        raise self.retry(exc=exc)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_reset_otp(self, otp: str,source:str,value:list[str], name: str):
    try:
        if source=="email":
            result=NotificationService.reset_email_otp(otp, name, value)
        else:
            result=NotificationService.send_reset_sms_otp(otp,name,value[0])
        return str(result)
    except Exception as exc:
        raise self.retry(exc=exc)
