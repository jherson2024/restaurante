// menu.component.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
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

  constructor(private apiService: ApiService, private authService: AuthService,private renderer: Renderer2) {
    this.clienteId = this.authService.getClienteId();
    if (this.clienteId === 0) {
      this.clienteId = 4;  // Default value if not set
    }
  }

  ngOnInit(): void {
    this.loadProductos();
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
      },
      error => {
        console.error('Error adding product to cart:', error);
      }
    );
  }
  moveToCart(event: any, productId: number, clienteId: number): void {
    const imageElement = event.target as HTMLElement;
    this.renderer.addClass(imageElement, 'moving-to-cart');
    
    imageElement.addEventListener('animationend', () => {
      this.showProductId(productId, clienteId);
      this.renderer.removeClass(imageElement, 'moving-to-cart');
    }, { once: true });
  }
}
