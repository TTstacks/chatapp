from django.urls import path
from .views import RegisterView, UserView, CookieTokenObtainPairView, CookieTokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('user', UserView.as_view()),
    path('token/', CookieTokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name = 'token_refresh')
]