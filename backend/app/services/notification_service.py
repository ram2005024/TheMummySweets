

import asyncio
import logging

import httpx

from app.core.config import settings
from app.core.logger import console
from app.utils.email_sender import send_email
from app.utils.render_html import render_html

logger=logging.getLogger(__name__)

class NotificationService:
    BASE_URL = "https://graph.facebook.com/v23.0"
    # Send otp via email
    @staticmethod
    def email_otp(otp:str,name:str,email):
        html=render_html("email/otp_template.html",name=name,otp=otp)
        result=asyncio.run(send_email("Verify your OTP",email,html))
        return result
    # Send reset otp via email
    @staticmethod
    def reset_email_otp(otp:str,name:str,email):
        html=render_html("email/forget_password.html",name=name,otp=otp)
        result=asyncio.run(send_email("Reset your password",email,html))
        return result

    # Send reset otp via sms
        # Send otp
    @classmethod
    def send_reset_sms_otp(
        cls,
        otp:str,
        name:str,
        phone_number:str
    ):
        # Development Mode
        if settings.DEBUG:
            console.print("=" * 60, style="info")
            console.print("📱 DEVELOPMENT SMS", style="success")
            console.print(f"Phone : {phone_number}", style="warning")
            console.print(f"Hi {name}.Your reset OTP  is {otp}", style="error")
            console.print("=" * 60, style="info")
            return
        # Production
        #!Production code for reset sms otp goes here!!!

    # Send otp
    @classmethod
    def send_sms_otp(
        cls,
        phone_number: str,
        otp: str,
        name:str
    ):
        # Development Mode
        if settings.DEBUG:
            console.print("=" * 60, style="info")
            console.print("📱 DEVELOPMENT SMS", style="success")
            console.print(f"Phone : {phone_number}", style="warning")
            console.print(f"Hi {name}.Your OTP is {otp}", style="error")
            console.print("=" * 60, style="info")

            return

        # Production Mode
        message = f"""
🍰 The Mummy Sweets
Hi, {name}
Your verification code is

{otp}

This code expires in 5 minutes.

Do not share it with anyone.
"""

        phone_number = phone_number.removeprefix("+")

        url = f"{cls.BASE_URL}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"

        headers = {
            "Authorization": f"Bearer {settings.WHATSAPP_TOKEN}",
            "Content-Type": "application/json",
        }

        payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "text",
            "text": {
                "body": message
            },
        }

        with httpx.Client() as client:
            response =client.post(
                url,
                json=payload,
                headers=headers,
            )

        return response.json()
