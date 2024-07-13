// login.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  @Output() loginSuccess: EventEmitter<void> = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private http: HttpClient, private apiService: ApiService, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.http.post<{ token: string, clienteId: number }>('http://localhost:8000/login/', { email, password })
        .subscribe(
          response => {
            this.apiService.getClienteById(response.clienteId).subscribe(
              clienteResponse => {
                this.authService.login(response.token, response.clienteId, clienteResponse.nombre);
                this.errorMessage = null;
                console.log('Login exitoso');
                this.router.navigate(['/menu']);
                this.loginSuccess.emit();
              },
              error => {
                console.error('Error al obtener el nombre del cliente', error);
                this.errorMessage = 'Login failed. Please try again.';
              }
            );
          },
          error => {
            this.errorMessage = 'Login failed. Please check your email and password.';
          }
        );
    }
  }
}
