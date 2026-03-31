from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import login, logout

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        # This creates a session (for browsable API/admin); later you’ll also return a token/JWT
        login(request, user)

        return Response(
            {
                "user": UserSerializer(user).data,
                "message": "Login successful.",
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)