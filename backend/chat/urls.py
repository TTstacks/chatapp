from django.urls import path
from .views import RoomMessageView, SearchUserView, CreateGroupView

urlpatterns = [
    path('<uuid:id>', RoomMessageView.as_view()),
    path('<uuid:id>/add-user', SearchUserView.as_view()),
    path('create-group', CreateGroupView.as_view())
]
