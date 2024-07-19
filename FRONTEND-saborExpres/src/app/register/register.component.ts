import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,CommonModule,HttpClientModule,ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService,private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log("registro valido")
      this.apiService.registrarCliente(this.registerForm.value).subscribe(
        response => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']); 
        },
        error => {
          console.error('Error en el registro', error);
        }
      );
    }else{
      console.log("registro invalido")
    }
  }
}
