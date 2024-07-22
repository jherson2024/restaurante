import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { AfterViewInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-confirmacion-orden',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './confirmacion-orden.component.html',
  styleUrl: './confirmacion-orden.component.css',
})
export class ConfirmacionOrdenComponent implements OnInit {
  productos: any[] = [];
  total: number = 0;
  ordenId: number | null = null;
  clienteId = 0;
  currentDate: string = '';
  currentTime: string = '';
  clienteNombre: string = '';
  @ViewChild('boleta') boleta!: ElementRef;
  correo: String = 'sabor_express@restaurante.com';
  mensaje:String="";

  constructor(private router: Router, private apiService: ApiService) {
    this.clienteId = parseInt(localStorage.getItem('clienteId') || '0', 10);
    if (this.clienteId == undefined) {
      this.clienteId == 4;
    }
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.productos = navigation.extras.state['productos'];
      this.total = navigation.extras.state['total'];
    }
  }

  ngOnInit(): void {
    this.setCurrentDateTime();
    this.crearOrden();
    this.obtenerNombreCliente();
  }

  setCurrentDateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString();
    this.currentTime = now.toLocaleTimeString();
  }
  crearOrden(): void {
    this.apiService
      .crearOrden(this.clienteId, this.total, this.productos)
      .subscribe(
        (data) => {
          this.ordenId = data.id;
          this.crearPago();
        },
        (error) => {
          console.error('Error creando la orden:', error);
        }
      );
  }
  crearPago():void{
    console.log("estsd"+this.ordenId)
    if (this.ordenId === null) {
      console.error('Orden ID no disponible');
      return;
    }
    const pago = {
      orden: this.ordenId, // Enviar solo el ID de la orden
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      metodo: 'Tarjeta de Crédito', // O el método de pago que estés usando
      monto: this.total,
      estado: true // Asumiendo que el pago se realiza con éxito
    };

    // Llamada al servicio para crear el pago
    this.apiService.crearPago(pago).subscribe({
      next: (response) => {
        console.log('Pago creado exitosamente:', response);
      },
      error: (error) => {
        console.error('Error al crear el pago:', error);
        // Manejo de errores
      }
    });
  }
  
  obtenerNombreCliente(): void {
    this.apiService.getClienteById(this.clienteId).subscribe(
      (data) => {
        this.clienteNombre = data.nombre;
        console.log('Nombre del cliente:', this.clienteNombre);
      },
      (error) => {
        console.error('Error obteniendo el nombre del cliente:', error);
      }
    );
  }
  ngAfterViewInit(): void {
    // La referencia boleta estará disponible aquí
    console.log(this.boleta); // Esto es solo para verificar si la referencia está disponible
  }
  generarPDF(): void {
    const data = this.boleta.nativeElement;
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('boleta.pdf');
    });
  }

  enviarBoletaPorEmail(): void {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Añadir contenido al PDF
    doc.text('Restaurante', 10, 10);
    doc.text('RESTAURANTE S.A.C', 10, 20);
    doc.text('R.U.C.: 20123456789', 10, 30);
    doc.text('Calle Paucarpata ***', 10, 40);
    doc.text('Cercado - Arequipa', 10, 50);
    doc.text('Tel: 123-4567', 10, 60);
    doc.text('info a restaurante.com', 10, 70);
    doc.text('BOLETA DE VENTA ELECTRÓNICA', 10, 80);
    doc.text(`Orden ID: ${this.ordenId}`, 10, 90);
    doc.text(`Fecha: ${this.currentDate}`, 10, 100);
    doc.text(`Hora: ${this.currentTime}`, 10, 110);
    doc.text(`CLIENTE: ${this.clienteNombre}`, 10, 120);

    const columns = ['Producto', 'Precio'];
    const rows = this.productos.map((producto) => [
      producto.nombre,
      producto.precio,
    ]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 130,
      styles: { fontSize: 10 },
      theme: 'grid',
    });

    doc.text(
      `Total: ${this.total}`,
      10,
      (doc as any).lastAutoTable.finalY + 10
    );

    const pdfBlob = doc.output('blob');
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1];

      if (base64data) {
        const email = 'fquispequ@unsa.edu.pe'; // Reemplaza con el email del cliente

        this.apiService.enviarBoleta(email, base64data).subscribe(
          (response) => {
            this.mensaje="Boleta enviada con éxito";
            console.log('Boleta enviada con éxito:', response);
          },
          (error) => {
            console.error('Error enviando la boleta:', error);
          }
        );
      } else {
        console.error('Error: El archivo PDF no pudo ser convertido a base64.');
      }
    };
  }
}
