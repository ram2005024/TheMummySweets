

import base64

from sentry_sdk import capture_exception

from app.core.celery_app import celery_app
from app.core.db import SyncSessionLocal
from app.models.image import Image
from app.modules.menu.models.product_model import Product
from app.modules.menu.utils import decode_image
from app.utils.upload_image import upload_image


@celery_app.task(bind=True,max_retries=3,default_retry_delay=30)
def upload_product_main_image(self,main_image:str,main_image_hash:str,product_id:str):
    try:
        main_image_bytes=base64.b64decode(main_image)
        main_image_url=upload_image(main_image_bytes,"product",main_image_hash,"products")

        with SyncSessionLocal() as db:
            product=db.query(Product).filter(Product.id==product_id).one_or_none()
            if not product:
                raise ValueError("Product doesn't exist")
            product.main_image=main_image_url
            image=Image(
                hash_value=main_image_hash,
                url=main_image_url
            )
            try:
                db.add(image)
                db.commit()
            except Exception as e:  # noqa: BLE001
                db.rollback()
                capture_exception(e)
                self.retry(exc=e)
                return {
                    "error":str(e)
                }
    except Exception as e:  # noqa: BLE001
        db.rollback()
        capture_exception(e)
        self.retry(exc=e)
        return {
            "error":str(e)
        }

@celery_app.task(bind=True,max_retries=3,default_retry_delay=30)
def upload_product_side_images(self,side_image_hash_and_bytes_content:list[tuple[str,str]],product_id:str):
    try:
        side_images_url=[]
        db=SyncSessionLocal()
        for hash,byte_content in side_image_hash_and_bytes_content:
            byte=decode_image(byte_content)
            url=upload_image(byte,"product",hash,"products")
            product=db.query(Product).filter(Product.id==product_id).one_or_none()
            if not product:
                raise ValueError("Product doesn't exist")
            side_images_url.append(url)
            image=Image(
                hash_value=hash,
                url=url
            )
            db.add(image)
        try:
            product.side_images=side_images_url
            db.commit()
        except Exception as e:  # noqa: BLE001
            db.rollback()
            capture_exception(e)
            self.retry(exc=e)
            return {
                "error":str(e)
            }
    except Exception as e:  # noqa: BLE001
        db.rollback()
        capture_exception(e)
        self.retry(exc=e)
        return {
            "error":str(e)
        }
    finally:
        db.close()
