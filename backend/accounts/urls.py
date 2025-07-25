from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet

router = DefaultRouter()

router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", TokenObtainPairView.as_view(), name="token_objtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
