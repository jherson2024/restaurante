import { Routes } from '@angular/router';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { PoliticasPrivacidadComponent } from './politicas-privacidad/politicas-privacidad.component';

export const routes: Routes = [

    { path: 'contactanos', component: ContactanosComponent },
    { path: 'login', component: LoginComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'navBar', component: NavBarComponent },
    { path: 'user-login', component: UserLoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'nosotros', component: NosotrosComponent },
    { path: 'terminos', component: TerminosCondicionesComponent },
    { path: 'politicas', component: PoliticasPrivacidadComponent },
    { path: 'cart',
      loadComponent: () =>
        import('./cart/cart.component').then((m) => m.CartComponent),
    },
    { path: 'pago',
      loadComponent: () =>
        import('./pago/pago.component').then((m) => m.PagoComponent),
    },
    { path: 'confirmacion-orden',
      loadComponent: () =>
        import('./confirmacion-orden/confirmacion-orden.component').then(
          (m) => m.ConfirmacionOrdenComponent
        ),
    },

];
