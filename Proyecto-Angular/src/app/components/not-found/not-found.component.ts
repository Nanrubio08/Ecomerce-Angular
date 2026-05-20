import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container text-center mt-5">
      <h1 class="display-1">404</h1>
      <h3>Página no encontrada</h3>
      <p>La página que buscas no existe o ha sido movida.</p>
      <a routerLink="/home" class="btn btn-primary">Volver al inicio</a>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}