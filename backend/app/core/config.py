import cloudinary
import cloudinary.uploader
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # DATABASE_CONFIG
    ASYNC_DATABASE_URL: str = ""
    SYNC_DATABASE_URL: str = ""

    # Cloudinary secrets
    CLOUD_NAME:str=""
    CLOUD_KEY:str=""
    CLOUD_SECRET:str=""

    # Redis
    REDIS_BROKER:str=""
    REDIS_BACKEND:str=""
    REDIS_HOST:str=""
    REDIS_PORT:int=0
    # MAIL CONF
    MAIL_USERNAME:str=""
    MAIL_PASSWORD:SecretStr=SecretStr("")
    MAIL_FROM:str=""
    MAIL_PORT:int=0
    MAIL_SERVER:str=""
    MAIL_STARTTLS:bool=False
    MAIL_SSL_TLS:bool=False

    WHATSAPP_TOKEN:str=""
    WHATSAPP_PHONE_NUMBER_ID:str=""

    DEBUG:bool=True


    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

# Cloudinary config
cloudinary.config(
    cloud_name=settings.CLOUD_NAME,
    api_key=settings.CLOUD_KEY,
    api_secret=settings.CLOUD_SECRET
)
