import { ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactanosComponent } from './contactanos/contactanos.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      {path: 'contactanos', component: ContactanosComponent},
  {path: 'login', component: LoginComponent},
      {path: 'menu', component: MenuComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'logout', component: LogoutComponent},
      {path: 'navBar', component: NavBarComponent},
      { path: 'user-login', component: UserLoginComponent },
  { path: 'dashboard', component: DashboardComponent },
      { path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent) },
  { path: 'pago', loadComponent: () => import('./pago/pago.component').then(m => m.PagoComponent) },
  { path: 'confirmacion-orden', loadComponent: () => import('./confirmacion-orden/confirmacion-orden.component').then(m => m.ConfirmacionOrdenComponent) }
 ]),
  ],
};


