from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Groups, Messages
from .serializers import MessagesSerializer, GroupsSerializer
from users.serializers import UserSerializer
from users.models import User

# Create your views here.
class RoomMessageView(APIView):
    def get(self, request, id):
        if request.user.users_in_group.filter(id = id).exists():
            g = Groups.objects.get(id = id)
            messages = Messages.objects.filter(group = g)
            messagesserializer = MessagesSerializer(messages, many = True)
            return Response(messagesserializer.data)
        return Response(status= status.HTTP_404_NOT_FOUND)

class SearchUserView(ListAPIView):
    serializer_class = UserSerializer
    
    def get_queryset(self):
        email = self.request.query_params.get('email')
        id = self.kwargs['id']
        
        return User.objects.filter(email__contains = email).exclude(users_in_group = Groups.objects.get(id = id))
    
class CreateGroupView(APIView):
    def post(self, request):
        g = Groups.objects.create(name = request.data.get('name'))
        g.save()
        print(request.user)
        g.users.add(request.user)
        gs = GroupsSerializer(g)
        return Response(data = gs.data)
