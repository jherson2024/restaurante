from multiprocessing import AuthenticationError
from rest_framework import serializers

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

# from myproject.myapp.models import Reservation, Table
from .models import CustomUser, Reservation, Table  # Usar importación relativa

User = get_user_model()


# *****************RESERVA*******************

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

# **************************************************


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")
     