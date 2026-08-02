


import base64
from typing import Annotated

from fastapi import File, UploadFile
from fastapi.responses import JSONResponse

from app.core.security import Auth
from app.modules.menu.repos.product_repo import ProductRepo
from app.modules.menu.schemas.product import ProductCreate
from app.schemas.common import SuccessResponse
from app.tasks.menu_task import upload_product_main_image, upload_product_side_images


class ProductService:
    def __init__(self,product_repo:ProductRepo) -> None:
        self.product_repo=product_repo

    # Services
    async def create_product_service(self,data:ProductCreate,main_image:Annotated[UploadFile,File(...)],side_images:Annotated[list[UploadFile]|None,File(None)]):
        new_product=await self.product_repo.create(data)
        already_available_main_image,already_available_side_images=await self.handle_image_upload(main_image,str(new_product.id),side_images)
        if already_available_main_image:
            await self.product_repo.upload_main_product_image(already_available_main_image,new_product.id)
        if already_available_side_images:
            await self.product_repo.upload_side_product_images(already_available_side_images,new_product.id)

        return JSONResponse(status_code=200,content=SuccessResponse(data=None,message="Product created").model_dump())


    async def handle_image_upload(self,main_image:UploadFile,product_id:str,side_images:list[UploadFile]|None=None):
        main_image_byte=await main_image.read()
        main_image_hash=Auth().hash_content(main_image_byte)
        main_image_content=base64.b64encode(main_image_byte).decode("utf-8")
        already_available_side_images=[]
        to_put_side_images=[]
        if side_images:
            for image in side_images:
                image_bytes=await image.read()
                encode=base64.b64encode(image_bytes).decode("utf-8")
                image_hash=Auth().hash_content(image_bytes)
                exists=await self.product_repo.find_image_by_hash(image_hash)
                if exists:
                    already_available_side_images.append(exists.url)
                else:
                    to_put_side_images.append((image_hash,encode))
        # For main image
        image_exist=await self.product_repo.find_image_by_hash(main_image_hash)
        main_image_string=None
        if image_exist:
            main_image_string=image_exist.url
        else:
            upload_product_main_image.delay(main_image_content,main_image_hash,product_id)
        if to_put_side_images:
            upload_product_side_images.delay(to_put_side_images,product_id)
        return main_image_string,already_available_side_images


