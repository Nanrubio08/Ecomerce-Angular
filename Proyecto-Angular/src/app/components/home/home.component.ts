import { Component } from '@angular/core';
import { CarruselComponent } from '../carrusel/carrusel.component';
import { DestacadosComponent } from '../destacados/destacados.component';
import { OfertasComponent } from "../ofertas/ofertas.component";
import { ProximamenteComponent } from "../proximamente/proximamente.component";
import { ProductosListaComponent } from '../productos-lista/productos-lista.component'; 


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarruselComponent, DestacadosComponent, OfertasComponent, ProximamenteComponent,ProductosListaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
