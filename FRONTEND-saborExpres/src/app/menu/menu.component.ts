// menu.component.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { ProductoService } from '../producto.service';

interface Producto {
  id: any;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string | null;
  imagen: string | null;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiService,ProductoService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  filteredProductos: Producto[] = [];
  productos: Producto[] = [];
  carrito: { producto_id: number, cliente_id: number }[] = [];
  clienteId = 1;  // ID del cliente
  carritoCount = 0; 
  selectedCategoria: string | null = null; 
  categorias: any[] = []; 

  constructor(private apiService: ApiService, private authService: AuthService,private renderer: Renderer2, private el: ElementRef,
    private productoService: ProductoService
  ) {
    this.clienteId = this.authService.getClienteId();
    if (this.clienteId === 0) {
      this.clienteId = 4;  // Default value if not set
    }
  }

  ngOnInit(): void {
    this.loadProductos();
    this.loadCategorias();
    this.obrenerNumeroProductosCarrito(); 
  }

  loadProductos(): void {
    this.apiService.getProductos().subscribe(
      data => {
        this.productos = data;
        this.filterProductos(); 
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
  loadCategorias(): void {
    this.productoService.obtenerCategorias().subscribe(
      data => {
        this.categorias = data;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
}
filterProductos(): void {
  console.log('Selected Category:', this.selectedCategoria);
  console.log('All Products:', this.productos);

  if (this.selectedCategoria) {
      const categoriaIndex = this.categorias.findIndex(categoria => categoria.nombre === this.selectedCategoria) + 1;
      console.log('Category Index:', categoriaIndex);

      this.filteredProductos = this.productos.filter(producto => {
          console.log('Producto:', producto.nombre, 'Categoria:', producto.categoria);
          return Number(producto.categoria) === categoriaIndex;
      });
      console.log('Filtered Products:', this.filteredProductos);
  } else {
      this.filteredProductos = this.productos;
      console.log('All Products (no filter):', this.filteredProductos);
  }
}
  onCategoriaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoria = selectElement.value;
    console.log(categoria);
    this.selectedCategoria = categoria;
    this.filterProductos();
  }

  showProductId(productId: number, clienteId: number): void {
    this.apiService.agregarProductoAlCarrito(clienteId, productId).subscribe(
      response => {
        this.carritoCount++; 
      },
      error => {
        console.error('Error adding product to cart:', error);
      }
    );
  }
  moveToCart(event: any, productId: number, clienteId: number): void {
    // Obtiene el botón que fue clickeado
    const buttonElement = event.target as HTMLElement;

    // Encuentra el contenedor del producto (div.parentElement)
    const productContainer = buttonElement.parentElement;

    // Verifica que el contenedor del producto no sea null
    if (!productContainer) {
        console.error('No se pudo encontrar el contenedor del producto.');
        return;
    }

    // Obtiene el elemento de imagen dentro del contenedor del producto
    const imageElement = productContainer.querySelector('.product-image') as HTMLElement;

    // Verifica que el elemento de imagen no sea null
    if (!imageElement) {
        console.error('No se pudo encontrar la imagen del producto.');
        return;
    }

    // Clona el elemento de imagen para crear una copia de la misma
    const clonedImage = imageElement.cloneNode(true) as HTMLElement;
    document.body.appendChild(clonedImage);

    // Obtiene el elemento del ícono del carrito
    const cartIcon = this.el.nativeElement.querySelector('#cart-icon');
    // Obtiene las coordenadas del ícono del carrito
    const cartRect = cartIcon.getBoundingClientRect();
    // Obtiene las coordenadas del elemento de imagen original
    const imgRect = imageElement.getBoundingClientRect();

    // Calcula la distancia en píxeles entre la imagen y el carrito en el eje X
    const deltaX = cartRect.left - imgRect.left;
    // Calcula la distancia en píxeles entre la imagen y el carrito en el eje Y
    const deltaY = cartRect.top - imgRect.top;

    // Establece el estilo de la imagen clonada para hacerla posicionable absolutamente
    this.renderer.setStyle(clonedImage, 'position', 'absolute');
    // Posiciona la imagen clonada en la misma posición que la imagen original
    this.renderer.setStyle(clonedImage, 'top', `${imgRect.top}px`);
    this.renderer.setStyle(clonedImage, 'left', `${imgRect.left}px`);
    // Ajusta el tamaño de la imagen clonada al mismo tamaño que la imagen original
    this.renderer.setStyle(clonedImage, 'width', `${imgRect.width}px`);
    this.renderer.setStyle(clonedImage, 'height', `${imgRect.height}px`);
    // Establece la transición CSS para animar la imagen
    this.renderer.setStyle(clonedImage, 'transition', 'transform 1s ease-in-out, opacity 1s');
    // Mueve la imagen clonada hacia el carrito
    this.renderer.setStyle(clonedImage, 'transform', `translate(${deltaX}px, ${deltaY}px)`);
    // Ajusta la opacidad de la imagen clonada para que sea semi-transparente durante la animación
    this.renderer.setStyle(clonedImage, 'opacity', '0.5');

    // Añade un listener para eliminar la imagen clonada del DOM una vez que la animación termina
    clonedImage.addEventListener('transitionend', () => {
        // Llama a la función showProductId para actualizar el carrito en el backend
        this.showProductId(productId, clienteId);
        // Elimina la imagen clonada del DOM
        document.body.removeChild(clonedImage);
    }, { once: true });
}

  obrenerNumeroProductosCarrito(): void {
    this.apiService.getProductosCarrito(this.clienteId).subscribe(
      data => {
        let totalProductos = 0;
        if (Array.isArray(data) && data.length > 0) {
          totalProductos = data.reduce((total, item) => total + (item.cantidad || 1), 0);
        }
        this.carritoCount = totalProductos; // Actualiza el contador del carrito
        console.log('Número de productos en el carrito:', this.carritoCount);
      },
      error => {
        console.error('Error fetching cart products:', error);
      }
    );
  }
}
