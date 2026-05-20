import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss'],
})
export class CarruselComponent {
  productos = [
    {
      nombre: 'Play Station 5',
      descripcion: 'Explora el poder de la nueva generación de consolas.',
      imagen: 'assets/images/PS5_Producto.jpg',
      alt: 'PlayStation 5'
    },
    {
      nombre: 'Xbox Series X',
      descripcion: 'Potencia y experiencia sin precedentes con Xbox Series X.',
      imagen: 'assets/images/Xbox_Producto.webp',
      alt: 'Xbox'
    },
    {
      nombre: 'Nintendo Switch',
      descripcion: 'Juega en casa o donde quieras con la consola híbrida.',
      imagen: 'assets/images/NintendoSwitch.webp',
      alt: 'Nintendo Switch'
    }
  ];
}