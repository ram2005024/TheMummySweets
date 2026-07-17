# Upload the image
import base64
import logging
from uuid import UUID

from app.core.celery_app import celery_app
from app.core.db import SyncSessionLocal
from app.models.user import Profile
from app.utils import upload_image

logger=logging.getLogger(__name__)
@celery_app.task
def upload_user_image(image_string:str,user_id:str):
    try:
        image_bytes=base64.b64decode(image_string)
        image_url=upload_image.upload_image(image_bytes,user_id)
        if image_url:
            db=SyncSessionLocal()
            profile=db.query(Profile).filter(Profile.user_id==UUID(user_id)).one_or_none()
            if not profile:
                raise ValueError("User doesn't exist")
            profile.image=image_url
            db.add(profile)
            db.commit()
        return {
            "message":"User image uploaded successfully"
        }
    except Exception as e:
        logger.error(str(e))
        db.rollback()
        raise e
    finally:
        db.close()
