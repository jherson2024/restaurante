// menu.component.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

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
  providers: [ApiService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  productos: Producto[] = [];
  carrito: { producto_id: number, cliente_id: number }[] = [];
  clienteId = 1;  // ID del cliente
  carritoCount = 0; 

  constructor(private apiService: ApiService, private authService: AuthService,private renderer: Renderer2, private el: ElementRef) {
    this.clienteId = this.authService.getClienteId();
    if (this.clienteId === 0) {
      this.clienteId = 4;  // Default value if not set
    }
  }

  ngOnInit(): void {
    this.loadProductos();
    this.obrenerNumeroProductosCarrito();
  }

  loadProductos(): void {
    this.apiService.getProductos().subscribe(
      data => {
        this.productos = data;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
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
    const imageElement = event.target as HTMLElement;
    const clonedImage = imageElement.cloneNode(true) as HTMLElement;
    document.body.appendChild(clonedImage);

    const cartIcon = this.el.nativeElement.querySelector('#cart-icon');
    const cartRect = cartIcon.getBoundingClientRect();
    const imgRect = imageElement.getBoundingClientRect();

    const deltaX = cartRect.left - imgRect.left;
    const deltaY = cartRect.top - imgRect.top;

    this.renderer.setStyle(clonedImage, 'position', 'absolute');
    this.renderer.setStyle(clonedImage, 'top', `${imgRect.top}px`);
    this.renderer.setStyle(clonedImage, 'left', `${imgRect.left}px`);
    this.renderer.setStyle(clonedImage, 'width', `${imgRect.width}px`);
    this.renderer.setStyle(clonedImage, 'height', `${imgRect.height}px`);
    this.renderer.setStyle(clonedImage, 'transition', 'transform 1s ease-in-out, opacity 1s');
    this.renderer.setStyle(clonedImage, 'transform', `translate(${deltaX}px, ${deltaY}px)`);
    this.renderer.setStyle(clonedImage, 'opacity', '0.5');

    clonedImage.addEventListener('transitionend', () => {
      this.showProductId(productId, clienteId);
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
