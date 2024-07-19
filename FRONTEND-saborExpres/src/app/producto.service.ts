// producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}crear-producto/`, producto);
  }

  eliminarProducto(productoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}eliminar-producto/${productoId}/`);
  }

  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}obtener_categorias/`);
  }
}
