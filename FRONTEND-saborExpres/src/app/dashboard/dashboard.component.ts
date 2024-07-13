  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { ProductoService } from '../producto.service';
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  import { HttpClientModule } from '@angular/common/http';

  @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ReactiveFormsModule,CommonModule,RouterLink,HttpClientModule],
    providers:[ProductoService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
  })
  export class DashboardComponent implements OnInit {
    productoForm: FormGroup;
    categorias: any[] = [];
    productos: any[] = [];
    selectedFile: File | null = null;

    constructor(private fb: FormBuilder, private productoService: ProductoService) {
      this.productoForm = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: [''],
        precio: ['', Validators.required],
        categoria_id: [''],
        // imagen_url: ['']
        imagen: [null]
      });
    }

    ngOnInit(): void {
      this.cargarCategorias();
      this.cargarProductos();
    }

    cargarCategorias() {
      this.productoService.obtenerCategorias().subscribe(
        data => {
          this.categorias = data;
        },
        error => {
          console.error('Error al cargar categorías', error);
        }
      );
    }

    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
    }

    cargarProductos() {
      // Aquí iría la lógica para cargar los productos existentes
    }

    crearProducto() {
      if (this.productoForm.valid && this.selectedFile) {
        const formData = new FormData();
        formData.append('nombre', this.productoForm.get('nombre')?.value);
        formData.append('descripcion', this.productoForm.get('descripcion')?.value);
        formData.append('precio', this.productoForm.get('precio')?.value);
        formData.append('categoria_id', this.productoForm.get('categoria_id')?.value);
        formData.append('imagen', this.selectedFile);
  
        this.productoService.crearProducto(formData).subscribe(
          response => {
            console.log('Producto creado', response);
            this.cargarProductos(); // Recargar la lista de productos
          },
          error => {
            console.error('Error al crear producto', error);
          }
        );
      }
    }

    eliminarProducto(productoId: number) {
      this.productoService.eliminarProducto(productoId).subscribe(
        response => {
          console.log('Producto eliminado', response);
          this.cargarProductos(); // Recargar la lista de productos
        },
        error => {
          console.error('Error al eliminar producto', error);
        }
      );
    }
  }