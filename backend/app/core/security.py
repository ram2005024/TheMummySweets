import random
from datetime import datetime, timedelta

import jwt
from jwt.exceptions import PyJWTError
from pwdlib import PasswordHash

from app.core.config import settings
from app.core.redis import redis
from app.exceptions.auth_exception import InvalidOrExpiredToken


class Auth:
    def __init__(self,
                 hash=PasswordHash.recommended(),
                 otp_expires_in=300,
                 login_limit=300,
                 max_login_attempt=5,
                 max_otp_attempt=5,
                 resend_time_limit=60
                 ):
        self.hash=hash
        self.MAXIMUM_LOGIN_ATTEMPT=max_login_attempt
        self.MAXIMUM_LOGIN_LIMIT=login_limit
        self.MAXIMUM_OTP_ATTEMPT=max_otp_attempt
        self.RESEND_AFTER=resend_time_limit
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
        return f"otp:{user_id}"

    def get_otp_attempt_key(self,user_id:str):
        return f"otp:attempt:{user_id}"

    async def set_otp_key(self,value,user_id):
        return await redis.setex(self.get_otp_key(user_id),self.otp_expires_in,value)
    async def set_otp_attempt(self,user_id:str):
        attempt=await redis.incr(self.get_otp_attempt_key(user_id))
        if attempt==1:
            await redis.expire(self.get_otp_attempt_key(user_id),300)
        return attempt

    async def delete_otp_attempt(self,user_id:str):
        key=self.get_otp_attempt_key(user_id)
        return await redis.delete(key)
    async def is_locked_otp(self,user_id:str):
        attempt_raw=await redis.get(self.get_otp_attempt_key(user_id))
        attempt=int(attempt_raw) if attempt_raw else 0
        if attempt>=self.MAXIMUM_OTP_ATTEMPT:
            ttl=await redis.ttl(self.get_otp_attempt_key(user_id))
            if ttl<0:
                ttl=0
            return True,ttl
        return False,0

    async def get_otp_value(self,user_id):
        otp=await redis.get(self.get_otp_key(user_id))
        return otp

    # Resend Redis
    def get_resend_key(self,user_id:str):
        return f"otp:resend:{user_id}"

    async def set_resend_key(self,user_id):
        return await redis.setex(self.get_resend_key(user_id),self.RESEND_AFTER,"1")

    async  def can_resend(self,user_id:str):
        key=self.get_resend_key(user_id)
        resend=await redis.get(key)
        if resend:
            ttl=await redis.ttl(key)
            return False,ttl
        return True,0

    async def delete_previous_otp_key(self,user_id:str):
        return await redis.delete(self.get_otp_key(user_id))


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

    def verify_token(self,token:str):
        try:
            payload=jwt.decode(token,settings.JWT_SECRET_KEY,algorithms=["HS256"])
            return payload
        except PyJWTError:
            raise InvalidOrExpiredToken

    async def set_refresh_into_redis(self,jti:str):
        return await redis.setex(name=f"refresh:{jti}",time=settings.REFRESH_EXPIRY*24*60*60,value="True")

    async def set_old_rotation_into_redis(self,prev:str,new:str):
        return await redis.setex(name=f"rotation:{prev}",time=30,value=new)
    async def get_old_rotation_into_redis(self,prev:str):
        return await redis.get(f"rotation:{prev}")

    async def get_refresh_from_redis(self,jti:str):
        return await redis.get(f"refresh:{jti}")
    async def delete_refresh_from_redis(self,jti:str):
        return await redis.delete(f"refresh:{jti}")






