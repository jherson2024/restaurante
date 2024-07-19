from django.urls import include, path

from django.contrib import admin

from . import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'productos', views.ProductoViewSet)
router.register(r'carritos', views.CarritoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('productos/', views.productos, name='productos'),
    path('login/', views.login_view, name='login'),
    path('obtener-productos/', views.obtener_productos, name='obtener_productos'),
     path('carrito/', views.carrito, name='carrito'),
     path('api/productos_carrito/', views.ProductosCarritoView.as_view(), name='productos_carrito'),
     path('api/crear-orden/', views.CrearOrdenView.as_view(), name='crear-orden'),
     path('api/clientes/<int:cliente_id>/', views.get_cliente, name='get_cliente'),
     path('api/registrar_cliente/', views.registrar_cliente, name='registrar_cliente'),
      path('api/user-login/', views.user_login_view, name='user_login'),
      path('api/crear-producto/', views.crear_producto, name='crear_producto'),
    path('api/eliminar-producto/<int:producto_id>/', views.eliminar_producto, name='eliminar_producto'),
     path('api/obtener_categorias/', views.obtener_categorias, name='obtener_categorias'),
     path('api/enviar_boleta/', views.enviar_boleta, name='enviar_boleta'),
     path('api/', include(router.urls)),
     path('api/obtener-precio-producto/', views.obtener_precio_producto, name='obtener_precio_producto'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
