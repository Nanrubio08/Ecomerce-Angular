import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.scss']
})
export class ProductosListaComponent implements OnInit {
  productos: Producto[] = [];
  productosPaginados: Producto[] = [];
  paginaActual = 0;
  productosPorPagina = 4;
  totalPaginas = 0;

  imagenError(producto: Producto) {
  console.warn('Imagen no encontrada:', producto.imagenUrl);
}
  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
  this.productoService.obtenerTodos().subscribe(data => {
  this.productos = data;
  this.totalPaginas = Math.ceil(this.productos.length / this.productosPorPagina);
  this.actualizarVista();
    });
  }

  actualizarVista(): void {
    const inicio = this.paginaActual * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    this.productosPaginados = this.productos.slice(inicio, fin);
  }

  siguiente(): void {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.actualizarVista();
    }
  }

  anterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarVista();
    }
  }
}