import uuid
from django.db import models
from django.conf import settings
# Create your models here.

class Groups(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="users_in_group")

class Chats(models.Model):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name= "users_in_chat")

class Messages(models.Model):
    text = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Groups, on_delete=models.CASCADE, null = True)
    chat = models.ForeignKey(Chats, on_delete=models.CASCADE, null = True)
    delivered = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["delivered"]