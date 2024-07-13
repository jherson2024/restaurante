from django.contrib import admin
from .models import Categoria, Producto, Cliente, Orden, DetalleOrden, Pago, Carrito, DetalleCarrito, User

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'categoria')
    search_fields = ('nombre',)
    list_filter = ('categoria',)

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'email', 'telefono')
    search_fields = ('nombre', 'email')

@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'fecha', 'total', 'estado')
    search_fields = ('cliente__nombre',)
    list_filter = ('estado',)

@admin.register(DetalleOrden)
class DetalleOrdenAdmin(admin.ModelAdmin):
    list_display = ('orden', 'producto', 'cantidad', 'precio')
    search_fields = ('orden__id', 'producto__nombre')

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('orden', 'fecha', 'metodo', 'monto', 'estado')
    search_fields = ('orden__id', 'metodo')
    list_filter = ('metodo', 'estado')

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'fecha_creacion', 'activo')
    search_fields = ('cliente__nombre',)

@admin.register(DetalleCarrito)
class DetalleCarritoAdmin(admin.ModelAdmin):
    list_display = ('carrito', 'producto')
    search_fields = ('carrito__cliente__nombre', 'producto__nombre')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)
