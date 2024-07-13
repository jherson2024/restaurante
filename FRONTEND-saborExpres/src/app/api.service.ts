import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any> {
    // return this.http.get<any[]>(`${this.baseUrl}/productos/`);
    return this.http.get(this.baseUrl + 'productos/');
  }

  agregarProductoAlCarrito(clienteId: number, productoId: number): Observable<any> {
    const data = {cliente_id: clienteId,producto_id: productoId};
    return this.http.post<any>(`${this.baseUrl}carritos/agregar_producto/`, data);
  }
  getCarrito(clienteId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}carritos/obtener_carrito/`);
  }
  getProductosCarrito(clienteId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}productos_carrito/?cliente_id=${clienteId}`);
  }
  crearOrden(clienteId: number, total: number, productos: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}crear-orden/`, { cliente_id: clienteId, total: total, productos: productos });
  }
  getClienteById(clienteId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}clientes/${clienteId}/`);
  }
  registrarCliente(data: { nombre: string, email: string, telefono: string, password: string }): Observable<any> {
    console.log("llego a api")
    return this.http.post<any>(`${this.baseUrl}registrar_cliente/`, data);
  }
  enviarBoleta(email: string, pdfData: string): Observable<any> {
    const url = `${this.baseUrl}enviar_boleta/`;
    const body = { email: email, pdf_data: pdfData };
    return this.http.post<any>(url, body);
  }
}
