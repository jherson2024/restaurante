  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { ProductoService } from '../producto.service';
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

  @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ReactiveFormsModule,CommonModule,RouterLink,HttpClientModule],
    providers:[ProductoService,ApiService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
  })
  export class DashboardComponent implements OnInit {
    productoForm: FormGroup;
    categoriaForm: FormGroup;
    categorias: any[] = [];
    productos: any[] = [];
    ordenes: any[] = [];
    selectedFile: File | null = null;

    constructor(private fb: FormBuilder, private productoService: ProductoService,private apiService: ApiService) {
      this.productoForm = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: [''],
        precio: ['', Validators.required],
        categoria_id: [''],
        // imagen_url: ['']
        imagen: [null]
      });
      this.categoriaForm = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: ['']
      });
    }

    ngOnInit(): void {
      this.cargarCategorias();
      this.cargarProductos();
      this.cargarOrdenes();
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
    cargarOrdenes() {
      this.apiService.obtenerTodasLasOrdenes().subscribe(
        data => {
          this.ordenes = data;
        },
        error => {
          console.error('Error al cargar órdenes', error);
        }
      );
    }
    marcarComoAtendida(ordenId: number) {
      this.apiService.marcarOrdenComoAtendida(ordenId).subscribe(
        response => {
          console.log('Orden marcada como atendida', response);
          this.ordenes = this.ordenes.filter(orden => orden.id !== ordenId); 
        },
        error => {
          console.error('Error al marcar orden como atendida', error);
        }
      );
    }
    

    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
    }

    cargarProductos() {
      this.apiService.getProductos().subscribe(
        data => {
          this.productos = data;
        },
        error => {
          console.error('Error al cargar productos', error);
        }
      );
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
    crearCategoria() {
      if (this.categoriaForm.valid) {
        const categoriaData = {
          nombre: this.categoriaForm.get('nombre')?.value,
          descripcion: this.categoriaForm.get('descripcion')?.value
        };
  
        this.productoService.crearCategoria(categoriaData).subscribe(
          response => {
            console.log('Categoría creada', response);
            this.cargarCategorias(); // Recargar la lista de categorías
          },
          error => {
            console.error('Error al crear categoría', error);
          }
        );
      }
    }
    eliminarCategoria(categoriaId: number) {
      this.apiService.eliminarCategoria(categoriaId).subscribe(
        response => {
          console.log('Categoría eliminada', response);
          this.cargarCategorias(); 
        },
        error => {
          console.error('Error al eliminar categoría', error);
        }
      );
    }
  }