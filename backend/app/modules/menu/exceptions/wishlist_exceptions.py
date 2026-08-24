from app.exceptions.base_custom_exception import AppException


class ProductAlreadyInWishlist(AppException):
    def __init__(
        self,
        message: str = "Product already exists in wishlist",
        status_code: int = 400,
        error_code: str = "PRODUCT_EXISTS_IN_WISHLIST",
    ):
        super().__init__(message, status_code, error_code)
