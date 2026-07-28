

from fastapi import Request

from app.core.oauth2 import oauth


class OauthService:
    def __init__(self) :
        self.oauth=oauth

    def provider(self,provider_name:str):
        return getattr(self.oauth,provider_name)

    # For login
    async def login(self,request:Request,provider_name:str):
        provider=self.provider(provider_name)
        redirect_url=request.url_for("oauth_callback",provider=provider_name)
        return await provider.authorize_redirect(redirect_url,request)
