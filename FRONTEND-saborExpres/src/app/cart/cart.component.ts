import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cart.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { ApiService } from '../api.service';
// import { Producto } from './menu/menu.component';

interface Productos {
  id: any;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string | null;
  imagen: string | null;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink,CommonModule, HttpClientModule,FormsModule],
  providers: [ApiService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  productos: Productos[] = [];
  clienteId = 1;

  constructor(private apiService: ApiService, private router: Router) {
    this.clienteId = parseInt(localStorage.getItem('clienteId') || '0', 10); 
    if (isNaN(this.clienteId)) {
      this.clienteId = 3;
    }
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.apiService.getProductosCarrito(this.clienteId).subscribe(
      data => {
        // Verifica si el data es un array y contiene productos
        if (Array.isArray(data) && data.length > 0) {
          // Mapea el objeto producto y agrega una cantidad predeterminada (si no existe)
          this.productos = data.map(item => ({
            ...item.producto,
            cantidad: item.cantidad || 1 // Asegura que cantidad tenga un valor
          }));
        }
        console.log('Productos carrito recibidos:', this.productos);
      },
      error => {
        console.error('Error fetching cart products:', error);
      }
    );
  }

  eliminarProducto(producto: Productos): void {
    // Aquí puedes agregar lógica para eliminar el producto del carrito en el backend
    this.apiService.eliminarProductoCarrito(this.clienteId, producto.id).subscribe(
      response => {
        this.productos = this.productos.filter(p => p.id !== producto.id);
        console.log(`Producto eliminado: ${producto.nombre}`);
      },
      error => {
        console.error('Error eliminando producto del carrito:', error);
      }
    );
  }

  calcularTotal(): number {
    return this.productos.reduce((acc, producto) => acc + parseFloat(producto.precio), 0);
  }

  procederPago(): void {
    const total = this.calcularTotal();
    this.router.navigate(['/pago'], { state: { productos: this.productos, total: total } });
  }
 
}