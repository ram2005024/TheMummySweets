


from app.exceptions.base_custom_exception import AppException


class ProductNotFound(AppException):
    def __init__(self, message: str="Product you are looking for doesn't exist", status_code: int=404, error_code: str="PRODUCT_NOT_FOUND"):
        super().__init__(message, status_code, error_code)
