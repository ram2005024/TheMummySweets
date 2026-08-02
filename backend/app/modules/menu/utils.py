

import base64


# Image utils
def encode_image(image:bytes):
    return base64.b64encode(image).decode("utf-8")

def decode_image(image:str):
    return base64.b64decode(image)


