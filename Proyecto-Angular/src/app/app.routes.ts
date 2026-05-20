import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register-page/register-page.component').then(m => m.RegisterPageComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./components/perfil/perfil.component').then(m => m.PerfilPageComponent)
  },
  {
    path: 'categoria/:nombre',
    loadComponent: () =>
      import('./components/categoria-page-component/categoria-page-component.component').then(m => m.CategoriaPageComponent)
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./components/carrito/carrito.component').then(m => m.CarritoComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
