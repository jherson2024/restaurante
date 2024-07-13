from django.urls import path, include
from .views import LoginView, LogoutView, RegisterView, example_view
from .views import product_list

# carrito
from .views import add_to_cart, remove_from_cart, get_cart


from rest_framework.routers import DefaultRouter
from .views import TableViewSet, ReservationViewSet


router = DefaultRouter()
router.register(r'tables', TableViewSet)
router.register(r'reservations', ReservationViewSet)


urlpatterns = [
    path('api/example/', example_view, name='example'),
    path('api/products/', product_list, name='product-list'),

    # carrito
    path('api/cart/add/', add_to_cart, name='add-to-cart'),
    path('api/cart/remove/', remove_from_cart, name='remove-from-cart'),
    path('api/cart/', get_cart, name='get-cart'),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),


    # ************RESERVA****
    path('', include(router.urls)),
]

urlpatterns += router.urls

