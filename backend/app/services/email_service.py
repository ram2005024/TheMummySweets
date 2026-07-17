



from app.utils.email_sender import send_email
from app.utils.render_html import render_html


class EmailService:

    @staticmethod
    async def email_otp(otp:str,name:str,email):
        html=render_html("email/otp_template.html",name=name,otp=otp)
        await send_email("Verify your OTP",email,html)

