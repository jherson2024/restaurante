import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [RouterLink,CommonModule,HttpClientModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {
  productos: any[] = [];
  total: number = 0;
  pagoRealizado = false;
  clienteId: number = 0;
  // private router: Router = new Router;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.productos = navigation.extras.state['productos'];
      this.total = navigation.extras.state['total'];
      this.clienteId = navigation.extras.state['clienteId'];
    }
  }

  ngOnInit(): void {
  
  }

  simularEscaneo() {
    this.pagoRealizado = true;
    this.router.navigate(['/confirmacion-orden'], { state: { productos: this.productos, total: this.total } });
  }
  
  calcularTotal(): number {
    return this.productos.reduce((acc, producto) => acc + parseFloat(producto.precio), 0);
  }
}