import random
from datetime import datetime, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import settings
from app.core.redis import redis


class Auth:
    def __init__(self,
                 hash=PasswordHash.recommended(),
                 otp_expires_in=3000,
                 login_limit=300,
                 max_login_attempt=5
                 ):
        self.hash=hash
        self.MAXIMUM_LOGIN_ATTEMPT=max_login_attempt
        self.MAXIMUM_LOGIN_LIMIT=login_limit
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

    def generate_key_login(self,field):
        return f"login:{field}"

    async def increase_attempt(self,field):
        attempt=await redis.incr(self.generate_key_login(field))
        if attempt==1:
            await redis.expire(self.generate_key_login(field),self.MAXIMUM_LOGIN_LIMIT)
        return

    async def is_locked(self,field):
        attempt_raw=await redis.get(self.generate_key_login(field))
        attempt=int(attempt_raw) if attempt_raw  else 0
        if attempt>=self.MAXIMUM_LOGIN_ATTEMPT:
            ttl:int=await redis.ttl(self.generate_key_login(field))
            if ttl<0:
                ttl=0
            return True,ttl//60
        return False,0

    def generate_access(self,data:dict):
        token_data=data.copy()
        token_data["exp"]=datetime.now()+timedelta(minutes=settings.ACCESS_EXPIRY)
        return jwt.encode(token_data, settings.JWT_SECRET_KEY, algorithm="HS256")
    def generate_refresh(self,data:dict):
        token_data=data.copy()
        token_data["exp"]=datetime.now()+timedelta(days=settings.REFRESH_EXPIRY)
        return jwt.encode(token_data, settings.JWT_SECRET_KEY, algorithm="HS256")

    async def set_refresh_into_redis(self,jti:str):
        return await redis.setex(name=f"refresh:{jti}",time=settings.REFRESH_EXPIRY*24*60*60,value="True")





