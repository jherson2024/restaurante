# from datetime import timezone
from django.utils import timezone 
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout

from django.shortcuts import render
from django.http import JsonResponse
from .models import CustomUser, Product
import os
from django.conf import settings

# carrito
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Product, Cart, CartItem
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, LoginSerializer


from rest_framework import viewsets
from .models import Table, Reservation
from .serializers import TableSerializer, ReservationSerializer


User = get_user_model()


# *************************RESERVA********************

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

# *************************RESERVA********************



class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        # Actualizar el campo last_login del usuario
        user.last_login = timezone.now()
        user.is_active = True
        user.save()


        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # Obtener el usuario del request
        
        try:
            user = request.user

            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            user = request.user
            user.is_active = False  # Actualizar el campo is_active
            user.save()
             # Realizar el logout
            logout(request)
            return Response({"detail": "Logged out successfully."}, status=200)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        




# Create your views here.
from django.http import JsonResponse

def example_view(request):
    data = {
        "message": "Hello from Django!"
    }
    return JsonResponse(data)

def product_list(request):
    products = list(Product.objects.values('id', 'name', 'description', 'price', 'discount_price', 'image'))
    for product in products:
        if product['image']:
            product['image'] = request.build_absolute_uri(os.path.join(settings.MEDIA_URL, product['image']))
    return JsonResponse(products, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def add_to_cart(request):
    data = json.loads(request.body)
    product_id = data['product_id']
    # product_id = data.get('id')
    quantity = data.get('quantity', 1)

    cart, created = Cart.objects.get_or_create(id=request.session.get('cart_id'))
    if created:
        request.session['cart_id'] = cart.id

    product = get_object_or_404(Product, id=product_id)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += quantity
    cart_item.save()

    return JsonResponse({'message': 'Product added to cart successfully'})

@csrf_exempt
@require_http_methods(["POST"])
def remove_from_cart(request):
    data = json.loads(request.body)
    product_id = data['product_id']

    cart = get_object_or_404(Cart, id=request.session.get('cart_id'))
    product = get_object_or_404(Product, id=product_id)
    cart_item = get_object_or_404(CartItem, cart=cart, product=product)
    cart_item.delete()

    return JsonResponse({'message': 'Product removed from cart successfully'})

def get_cart(request):
    try:
        cart = Cart.objects.get(id=request.session.get('cart_id'))
    except Cart.DoesNotExist:
        return JsonResponse({'items': [], 'total_price': 0})

    items = cart.items.select_related('product').all()
    items_data = [
        {
            'id': item.id,
            'product_id': item.product.id,
            'name': item.product.name,
            'price': item.product.price,
            'discount_price': item.product.discount_price,
            'quantity': item.quantity
        }
        for item in items
    ]
    total_price = sum((item.product.discount_price if item.product.discount_price else item.product.price) * item.quantity for item in items)
    return JsonResponse({'items': items_data, 'total_price': total_price})