import base64
from datetime import timezone
from email.message import EmailMessage
import json
import tempfile
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from rest_framework.views import APIView
from res.serializers import CarritoSerializer
from sabor_Expres.settings import EMAIL_HOST_PASSWORD, EMAIL_HOST_USER
from .models import Carrito, DetalleCarrito, Producto, Categoria, Cliente, Orden, DetalleOrden, User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Producto, Carrito, DetalleCarrito, Cliente
from .serializers import OrdenSerializer, ProductoCarritoSerializer, ProductoSerializer, CarritoSerializer, DetalleCarritoSerializer
from django.core.mail import EmailMessage, get_connection
import traceback


def index(request):
    productos = Producto.objects.all()
    for producto in productos:
        print(producto.nombre, producto.precio)  
    return render(request, 'index.html', {'productos': productos})


def home(request):
    return render(request, 'home.html')


@csrf_exempt
def productos(request):
    if request.method == 'GET':
        productos = Producto.objects.all()
        return render(request, 'productos.html', {'productos': productos})
    elif request.method == 'POST':
        data = json.loads(request.body)
        producto = Producto.objects.create(**data)
        return JsonResponse({'id': producto.id}, status=201)




@csrf_exempt
@require_http_methods(["POST"])
def obtener_precio_producto(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            nombre_producto = data.get('nombre').strip().lower()
            print(f"Nombre del producto recibido: {nombre_producto}")
            producto = Producto.objects.get(nombre__iexact=nombre_producto)
            return JsonResponse({'precio': producto.precio}, status=200)
        except Producto.DoesNotExist:
            return JsonResponse({'error': 'Producto no encontrado'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error en el formato de los datos'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body)
        email = data.get('email').strip().lower()
        password = data.get('password')
        cliente = Cliente.objects.get(email=email)
       
        if cliente.password == password:  # Comparar directamente las contraseñas
            return JsonResponse({'token': 'your_generated_token', 'clienteId': cliente.id}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Error en el formato de los datos'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
   
@csrf_exempt
@require_http_methods(["GET"])
def obtener_productos(request):
    productos = Producto.objects.all()
    productos_json = [
        {
            'nombre': producto.nombre,
            'descripcion': producto.descripcion,
            'precio': str(producto.precio),
            'categoria': producto.categoria.nombre if producto.categoria else None,
            'imagen_url': request.build_absolute_uri(f'/static/{producto.imagen_url}') if producto.imagen_url else None
        }
        for producto in productos
    ]
    return JsonResponse(productos_json, safe=False)


@csrf_exempt
def carrito(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            print('Datos recibidos en el servidor:', data)  


            for item in data:
                cliente_id = item['cliente_id']
                producto_id = item['producto_id']
               
                cliente = Cliente.objects.get(id=cliente_id)
                producto = Producto.objects.get(id=producto_id)
               
                carrito, created = Carrito.objects.get_or_create(cliente=cliente, activo=True)
                DetalleCarrito.objects.create(carrito=carrito, producto=producto, cantidad=1)
           
            return JsonResponse({'message': 'Carrito procesado correctamente'}, status=201)
        except Exception as e:
            print(f"Error al procesar la solicitud POST: {e}")
            return JsonResponse({'error': 'Error interno del servidor'}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)




def eliminar_del_carrito(request, cliente_id, producto_id):
    if request.method == 'DELETE':
        try:
            carrito = Carrito.objects.get(cliente_id=cliente_id, activo=True)
            DetalleCarrito.objects.filter(carrito=carrito, producto_id=producto_id).delete()
            return JsonResponse({'message': 'Producto eliminado del carrito'}, status=200)
        except Carrito.DoesNotExist:
            return JsonResponse({'error': 'Carrito no encontrado'}, status=404)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


from rest_framework import viewsets
from .serializers import ProductoSerializer, ClienteSerializer, DetalleCarritoSerializer,CarritoSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class DetalleCarritoViewSet(viewsets.ModelViewSet):
    queryset = DetalleCarrito.objects.all()
    serializer_class = DetalleCarritoSerializer




from rest_framework.response import Response
from rest_framework.decorators import api_view


class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer


    @action(detail=False, methods=['post'])
    def agregar_producto(self, request):
        data = request.data
        producto_id = data.get('producto_id')
        cliente_id = data.get('cliente_id')
        #obtiene el producto y el cliente
        producto = get_object_or_404(Producto, pk=producto_id)
        cliente = get_object_or_404(Cliente, pk=cliente_id)
        # Obtener el carrito existente para el cliente
        try:
            carrito = Carrito.objects.get(cliente=cliente, activo=True)
        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=404)
        # Agregar el producto al carrito
        DetalleCarrito.objects.create(carrito=carrito, producto=producto)


        return Response({'status': 'Solicitud POST recibida'}, status=200)
    
    @action(detail=False, methods=['post'])
    def eliminar_producto(self, request):
        data = request.data
        producto_id = data.get('producto_id')
        cliente_id = data.get('cliente_id')
        carrito = get_object_or_404(Carrito, cliente_id=cliente_id, activo=True)
        detalles = DetalleCarrito.objects.filter(carrito=carrito, producto_id=producto_id)
        
        if detalles.exists():
            detalles.delete()
            return Response({'status': 'Producto eliminado del carrito'}, status=200)
        else:
            return Response({'error': 'Producto no encontrado en el carrito'}, status=404)
   
from rest_framework import status
class ProductosCarritoView(APIView):
    def get(self, request, *args, **kwargs):
        cliente_id = request.query_params.get('cliente_id', None)
        if cliente_id is not None:
            try:
                carrito = Carrito.objects.get(cliente_id=cliente_id, activo=True)
                detalles = DetalleCarrito.objects.filter(carrito=carrito)
                serializer = DetalleCarritoSerializer(detalles, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Carrito.DoesNotExist:
                return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "cliente_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)


class CrearOrdenView(APIView):
    def post(self, request):
        cliente_id = request.data.get('cliente_id')
        productos = request.data.get('productos')
        total = request.data.get('total')


        if not cliente_id:
            return Response({"error": "El cliente_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)
       
        if not productos:
            return Response({"error": "Los productos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
       
        if not total:
            return Response({"error": "El total es requerido"}, status=status.HTTP_400_BAD_REQUEST)


        try:
            cliente = Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
       
        try:
            orden = Orden.objects.create(
                cliente=cliente,
                fecha=timezone.now().date(),  # Usando solo la parte de la fecha
                total=total,
                estado='no pagado'
            )
            for prod in productos:
                producto = Producto.objects.get(id=prod['id'])
                DetalleOrden.objects.create(
                    orden=orden,
                    producto=producto,
                    cantidad=1,
                    precio=producto.precio
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
        serializer = OrdenSerializer(orden)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def get_cliente(request, cliente_id):
    cliente = get_object_or_404(Cliente, id=cliente_id)
    data = {
        'id': cliente.id,
        'nombre': cliente.nombre,
    }
    return JsonResponse(data)


@csrf_exempt
def registrar_cliente(request):
    print("llego aqui")
    if request.method == 'POST':
        data = json.loads(request.body)
        nombre = data.get('nombre')
        email = data.get('email')
        telefono = data.get('telefono')
        password = data.get('password')


        if not (nombre and email and password):
            return JsonResponse({'error': 'Faltan campos obligatorios'}, status=400)


        if Cliente.objects.filter(email=email).exists():
            return JsonResponse({'error': 'El email ya está registrado'}, status=400)


        cliente = Cliente(nombre=nombre, email=email, telefono=telefono,password=password)
       
        cliente.save()
        carrito = Carrito(cliente=cliente)
        carrito.save()
        return JsonResponse({'mensaje': 'Cliente registrado exitosamente'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)
from django.contrib.auth.hashers import check_password

from django.contrib.auth import authenticate

@csrf_exempt
@require_http_methods(["POST"])
def user_login_view(request):
    try:
        data = json.loads(request.body)
        nombre = data.get('nombre').strip()
        password = data.get('password')

        # Autenticar al usuario
        user = authenticate(username=nombre, password=password)

        if user is not None:
            if user.is_superuser:
                return JsonResponse({'token': 'your_generated_token', 'userId': user.id, 'nombre': user.username}, status=200)
            else:
                return JsonResponse({'error': 'No tienes permisos para acceder'}, status=403)
        else:
            return JsonResponse({'error': 'Credenciales inválidas'}, status=400)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Error en el formato de los datos'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
   
@csrf_exempt
@require_http_methods(["POST"])
def crear_producto(request):
    try:
        # Verificar si es una solicitud multipart/form-data
        if request.content_type.startswith('multipart/form-data'):
            nombre = request.POST.get('nombre')
            descripcion = request.POST.get('descripcion', '')
            precio = request.POST.get('precio')
            categoria_id = request.POST.get('categoria_id')
            imagen = request.FILES.get('imagen')  # Obtener el archivo de imagen


            categoria = Categoria.objects.get(id=categoria_id) if categoria_id else None


            producto = Producto.objects.create(
                nombre=nombre,
                descripcion=descripcion,
                precio=precio,
                categoria=categoria,
                imagen=imagen  # Guardar la imagen
            )


            return JsonResponse({'mensaje': 'Producto creado exitosamente', 'producto_id': producto.id}, status=201)
        else:
            return JsonResponse({'error': 'Tipo de contenido no soportado'}, status=400)
    except Categoria.DoesNotExist:
        return JsonResponse({'error': 'Categoría no encontrada'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def eliminar_producto(request, producto_id):
    try:
        producto = Producto.objects.get(id=producto_id)
        producto.delete()
        return JsonResponse({'mensaje': 'Producto eliminado exitosamente'}, status=200)
    except Producto.DoesNotExist:
        return JsonResponse({'error': 'Producto no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
   
def obtener_categorias(request):
    categorias = Categoria.objects.all()
    categorias_list = [{'id': categoria.id, 'nombre': categoria.nombre} for categoria in categorias]
    return JsonResponse(categorias_list, safe=False)


from email.mime.application import MIMEApplication


import logging
logger = logging.getLogger(__name__)


@api_view(['POST'])
def enviar_boleta(request):
    print("antes :::: mensajede depuacion")
    try:
        print("despues :::: mensajede depuacion")
        cliente_email = request.data.get('email')
        print("entro a try envio email 1")
        pdf_data = request.data.get('pdf_data')  # Base64 encoded PDF data
        print("entro a try envio email 2")
        if not cliente_email or not pdf_data:
            return JsonResponse({'message': 'Email y PDF son requeridos'}, status=400)
        print("entro a try envio email 3")
        pdf_content = base64.b64decode(pdf_data)


        part = MIMEApplication(pdf_content, _subtype="pdf")
        part.add_header('Content-Disposition', 'attachment', filename='boleta.pdf')


        print(cliente_email)
        email = EmailMessage()
        connection = get_connection(
            backend='django.core.mail.backends.smtp.EmailBackend',
            host='smtp.gmail.com',
            port=587,
            username=EMAIL_HOST_USER,
            password=EMAIL_HOST_PASSWORD,
            use_tls=True
        )


        email.subject = 'Boleta de Venta'
        email.body = 'Adjunto encontrarás tu boleta de venta.'
        email.from_email = EMAIL_HOST_USER  
        email.to = [cliente_email]
        print("entro a try envio email 5")
        email.attach('boleta.pdf', pdf_content, 'application/pdf')
        print("entro a try envio email 6")
        try:
            connection.open()
            email.connection = connection
            email.send(fail_silently=False)
            connection.close()
            logger.debug("Correo enviado")
            return JsonResponse({'message': 'Boleta enviada con éxito'})
        except Exception as e:
            logger.error("Error enviando correo: %s", traceback.format_exc())
            return JsonResponse({'message': 'Error enviando correo', 'details': str(e)}, status=500)


    except Exception as e:
        logger.error("Error en la vista enviar_boleta: %s", traceback.format_exc())
        return JsonResponse({'message': 'Error en la vista enviar_boleta', 'details': str(e)}, status=500)


