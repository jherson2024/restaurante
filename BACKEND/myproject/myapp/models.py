from django.db import models

# from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractUser, Group, Permission


# ********************RESERVA************************
class Table(models.Model):
    number = models.IntegerField(unique=True)
    seats = models.IntegerField()
    status = models.CharField(max_length=10, default='available')

    def __str__(self):
        return f"Table {self.number}"

class Reservation(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    date = models.DateTimeField()
    status = models.CharField(max_length=10, default='pending')

    def __str__(self):
        return f"Reservation for {self.name} at {self.date}"
    
# ****************************************************

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # Cambiar el related_name para evitar conflicto
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',  # Cambiar el related_name para evitar conflicto
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='user',
    )



class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/')
    category = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    reviews = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Cart(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.product.name} ({self.quantity})'
