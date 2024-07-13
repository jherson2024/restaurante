import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { CartService } from './cart.service';
import { PagoComponent } from './pago/pago.component';
import { ConfirmacionOrdenComponent } from './confirmacion-orden/confirmacion-orden.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactanosComponent } from './contactanos/contactanos.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    RouterLink,FormsModule,NavBarComponent,LoginComponent,CommonModule,CartComponent,PagoComponent,
  ConfirmacionOrdenComponent,HttpClientModule,RegisterComponent,LogoutComponent,
   UserLoginComponent,DashboardComponent,ContactanosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'saborExpres';
  cartItemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItemCount = cart.length;
    });
  }
  onActivate(event: any): void {
    if (event.loginSuccess) {
      event.loginSuccess.subscribe(() => {
        const navbarComponent = document.querySelector('app-navbar');
        if (navbarComponent) {
          (navbarComponent as any).updateLoginStatus();
        }
      });
    }
  }
}

