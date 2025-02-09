from rest_framework import serializers
from .models import Groups, Messages
from users.serializers import UserSerializer


class GroupsSerializer(serializers.ModelSerializer):
    users = serializers.SlugRelatedField(many = True, read_only = True, slug_field = 'email')
    
    class Meta:
        model = Groups
        fields = ['id', 'name', 'users']


class MessagesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)

    class Meta:
        model = Messages
        fields = ['text', 'user', 'delivered']
