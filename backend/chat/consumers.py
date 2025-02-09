import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Groups, Messages
from users.models import User
from .serializers import GroupsSerializer, MessagesSerializer

class RoomConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.room_id = self.scope['url_route']['kwargs']['room_id']

        if self.user.users_in_group.filter(id = self.room_id).exists():
            async_to_sync(self.channel_layer.group_add)(
                self.room_id, self.channel_name
            )
            self.accept()

    def disconnect(self, code):
        
        async_to_sync(self.channel_layer.group_discard)(
            self.room_id, self.channel_name
        )
    
    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json["text"]
        m = Messages(text = message, user = self.user, group = Groups.objects.get(id = self.room_id))
        m.save()
        ms = MessagesSerializer(m)
        async_to_sync(self.channel_layer.group_send)(
            self.room_id, {"type": "group.message", "message": ms.data}
        )
    
    def group_message(self, event):
        message = event["message"]
        self.send(text_data=json.dumps(message))


class AddUserConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']

        async_to_sync(self.channel_layer.group_add)(
            f"user_{self.user.id}", self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        
        async_to_sync(self.channel_layer.group_discard)(
            f"user_{self.user.id}", self.channel_name
        )
    
    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        id = text_data_json["id"]
        emails = text_data_json["emails"]

        g = Groups.objects.get(id = id)
        g.users.add(*User.objects.filter(email__in = emails))

        gs = GroupsSerializer(g)
        for user in g.users.all():
            async_to_sync(self.channel_layer.group_send)(
                f"user_{user.id}", {"type": "add.user", "group": gs.data}
            )
    
    def add_user(self, event):
        group = event['group']
        self.send(text_data=json.dumps(group))

