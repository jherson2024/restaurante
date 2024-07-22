from rest_framework import serializers
from .models import Orden, Pago, Producto, Carrito, DetalleCarrito, Cliente

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class DetalleCarritoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer()

    class Meta:
        model = DetalleCarrito
        fields = '__all__'

class CarritoSerializer(serializers.ModelSerializer):
    detalles = DetalleCarritoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'cliente', 'fecha_creacion', 'activo', 'detalles']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orden
        fields = '__all__'

class ProductoCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer):
    orden = serializers.PrimaryKeyRelatedField(queryset=Orden.objects.all())
    class Meta:
        model = Pago
        fields = ['orden', 'fecha', 'metodo', 'monto', 'estado']

        