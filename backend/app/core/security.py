import random

from pwdlib import PasswordHash

from app.core.redis import redis


class Auth:
    def __init__(self,
                 hash=PasswordHash.recommended(),
                 otp_expires_in=3000,
                 ):
        self.hash=hash
        self.otp_expires_in=otp_expires_in

    def hash_content(self,content:str):
        return self.hash.hash(content)

    def verify_hash(self,plain_text,cipher_text):
        is_matched=self.hash.verify(plain_text,cipher_text)
        return is_matched

    def generate_otp(self):
        otp=random.randint(100000,999999)
        return otp

    def get_otp_key(self,user_id:str):
        return f"otp-{user_id}"

    async def set_otp_key(self,value,user_id):
        return await redis.setex(self.get_otp_key(user_id),self.otp_expires_in,value)

