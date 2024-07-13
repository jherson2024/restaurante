// nav-bar.component.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  clienteNombre: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
      this.clienteNombre = this.authService.getClienteNombre();
    });

    // Inicializar los valores
    this.isLoggedIn = !!localStorage.getItem('token');
    this.clienteNombre = localStorage.getItem('clienteNombre');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
