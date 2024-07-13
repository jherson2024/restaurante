// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Producto {
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string | null;
  imagen_url: string | null;
  cantidad?: number;  // Añadir cantidad opcional
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Producto[] = [];
  private cartSubject = new BehaviorSubject<Producto[]>(this.cart);

  constructor() { }

  addToCart(producto: Producto): void {
    const item = this.cart.find(p => p.nombre === producto.nombre);
    if (item) {
      item.cantidad = (item.cantidad || 1) + 1;
    } else {
      this.cart.push({ ...producto, cantidad: 1 });
    }
    this.cartSubject.next(this.cart);
  }

  getCart() {
    return this.cartSubject.asObservable();
  }

  removeFromCart(producto: Producto): void {
    this.cart = this.cart.filter(p => p !== producto);
    this.cartSubject.next(this.cart);
  }

  clearCart(): void {
    this.cart = [];
    this.cartSubject.next(this.cart);
  }

  updateCart(producto: Producto): void {
    const item = this.cart.find(p => p.nombre === producto.nombre);
    if (item) {
      item.cantidad = producto.cantidad;
    }
    this.cartSubject.next(this.cart);
  }
}
