from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "date_joined"]
        read_only_fields = ["id", "date_joined"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type":"password"},
    )

    class Meta:
        model = User
        fields = ["email", "name", "password"]

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(
            password=password,
            **validated_data,
        )
        return user

from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(request=self.context.get("request"), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password.", code="authorization")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        attrs["user"] = user
        return attrs