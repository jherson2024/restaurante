import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import {AfterViewInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-confirmacion-orden',
  standalone: true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './confirmacion-orden.component.html',
  styleUrl: './confirmacion-orden.component.css'
})
export class ConfirmacionOrdenComponent implements OnInit {
  productos: any[] = [];
  total: number = 0;
  ordenId: number | null = null;
  clienteId=0;
  currentDate: string = '';
  currentTime: string = '';
  clienteNombre: string = '';
  @ViewChild('boleta') boleta!: ElementRef;

  constructor(private router: Router,private apiService: ApiService){
    this.clienteId = parseInt(localStorage.getItem('clienteId') || '0', 10); 
      if(this.clienteId==undefined){
        this.clienteId==4;
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
    this.apiService.crearOrden(this.clienteId, this.total, this.productos).subscribe(
      data => {
        this.ordenId = data.id;
        console.log('Orden creada:', data);
      },
      error => {
        console.error('Error creando la orden:', error);
      }
    );
  }
  obtenerNombreCliente(): void {
    this.apiService.getClienteById(this.clienteId).subscribe(
      data => {
        this.clienteNombre = data.nombre;
        console.log('Nombre del cliente:', this.clienteNombre);
      },
      error => {
        console.error('Error obteniendo el nombre del cliente:', error);
      }
    );
  }
  ngAfterViewInit(): void {
    // La referencia boleta estará disponible aquí
    console.log(this.boleta); // Esto es solo para verificar si la referencia está disponible
  }
  generarPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(12);
    
    // Adding styles
    const style = `
      body {
    font-family: 'Courier New', Courier, monospace;
    background-color: #f4f4f4;
    color: #333;
  }
  
  div {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 0px solid #000;
    border-radius: 0px;
    background: #fff;
    box-shadow: 0 0 0px rgba(0, 0, 0, 0.1);
    text-align: center;
    background-color: rgb(234, 230, 222);
  }
  #principal{
    background-color: rgb(234, 230, 222);
    border: 1px solid #000;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  h2 {
    font-size: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 16px;
    margin: 5px 0;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 20px 0;
    text-align: left;
  }
  
  ul li {
    font-size: 16px;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
  }
  
  ul li:last-child {
    border-bottom: none;
  }
  
  .logo-image {
    max-width: 100px;
    margin-bottom: 20px;
  }
  
  p.error-message {
    font-size: 18px;
    color: red;
    text-align: center;
  }
  
  p.total {
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    border-top: 2px solid #000;
    padding-top: 10px;
  }
  
  .header-section {
    border-bottom: 2px solid #000;
    margin-bottom: 10px;
  }
  
  .details-section {
    margin-bottom: 20px;
  }
  
  .client-info {
    font-size: 18px;
    font-weight: bold;
  }
  
  .bold {
    font-weight: bold;
  }

  
    `;

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

    const columns = ["Producto", "Precio"];
    const rows = this.productos.map(producto => [producto.nombre, producto.precio]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 130,
      styles: { fontSize: 10 },
      theme: 'grid'
    });

    doc.text(`Total: ${this.total}`, 10, (doc as any).lastAutoTable.finalY + 10);

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);

    // Abre el PDF en una nueva pestaña
    window.open(url, '_blank');

    // También puedes usar FileSaver.js para descargar el PDF
    saveAs(pdfBlob, 'boleta.pdf');
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
  
    const columns = ["Producto", "Precio"];
    const rows = this.productos.map(producto => [producto.nombre, producto.precio]);
  
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 130,
      styles: { fontSize: 10 },
      theme: 'grid'
    });
  
    doc.text(`Total: ${this.total}`, 10, (doc as any).lastAutoTable.finalY + 10);
  
    const pdfBlob = doc.output('blob');
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1];
  
      if (base64data) {
        const email = 'fquispequ@unsa.edu.pe'; // Reemplaza con el email del cliente
  
        this.apiService.enviarBoleta(email, base64data).subscribe(
          response => {
            console.log('Boleta enviada con éxito:', response);
          },
          error => {
            console.error('Error enviando la boleta:', error);
          }
        );
      } else {
        console.error('Error: El archivo PDF no pudo ser convertido a base64.');
      }
    };
  }}