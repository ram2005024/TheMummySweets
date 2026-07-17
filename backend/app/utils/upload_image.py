import cloudinary.uploader


def upload_image(image_bytes:bytes,tag_name:str):
    try:
        result=cloudinary.uploader.upload(image_bytes,folder="user_images",public_id=f"image-{tag_name}",overwrite=True)
        return result["secure_url"]
    except Exception as e:
        raise e
