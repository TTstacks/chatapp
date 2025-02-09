from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.sessions import CookieMiddleware
from channels.db import database_sync_to_async
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import User
import jwt

import logging

logger = logging.getLogger(__name__)


class JWTAuthMiddleware:

    def __init__(self, inner):
        self.inner = inner

    def get_user(self, user_id):
        return User.objects.get(id = user_id)

    async def __call__(self, scope, receive, send):
        close_old_connections()
        
        jwt_cookie = scope['cookies'].get('refresh_token')
        
        if not jwt_cookie:
            scope['user'] = AnonymousUser()
        else:
            try:
                t = jwt.decode(jwt_cookie, key = settings.SECRET_KEY, algorithms=['HS256'])
                scope['user'] = await database_sync_to_async(self.get_user)(t['user_id'])
            except Exception as e:
                scope['user'] = AnonymousUser()
        
        return await self.inner(scope, receive, send)
    
def JWTAuthMiddlewareStack(inner):

    return CookieMiddleware(JWTAuthMiddleware(inner))