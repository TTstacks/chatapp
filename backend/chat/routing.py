from django.urls import re_path

from .consumers import RoomConsumer, AddUserConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_id>[0-9A-Fa-f-]+)/$", RoomConsumer.as_asgi()),
    re_path(r'ws/chat/$', AddUserConsumer.as_asgi())
]