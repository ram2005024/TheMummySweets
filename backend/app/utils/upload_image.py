import cloudinary.uploader


def upload_image(image_bytes:bytes,tag_name:str,tag_id:str,folder_name:str):
    try:
        result=cloudinary.uploader.upload(image_bytes,folder=folder_name,public_id=f"{tag_name}-{tag_id}",overwrite=True)
        return result["secure_url"]
    except Exception as e:  # noqa: BLE001
        raise str(e) # type: ignore
