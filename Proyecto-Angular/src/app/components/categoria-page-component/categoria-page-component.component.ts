import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductosListaComponent } from '../productos-lista/productos-lista.component';

@Component({
  selector: 'app-categoria-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ProductosListaComponent],
  templateUrl: './categoria-page-component.component.html',
  styleUrls: ['./categoria-page-component.component.scss']
})
export class CategoriaPageComponent implements OnInit {
  productos: Producto[] = [];
  categoria = '';

  constructor(private route: ActivatedRoute, private productoService: ProductoService) {}

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.categoria = params.get('nombre') || '';
    this.productoService.obtenerTodos().subscribe({
      next: (productos: Producto[]) => {
        // Filter client-side since the new backend returns all products
        this.productos = productos.filter(p => 
          p.categoria?.toLowerCase() === this.categoria.toLowerCase()
        );
      },
      error: (err: any) => console.error('Error al cargar productos:', err)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

  imagenError(producto: Producto): void {
    producto.imagenUrl = '/assets/images/default.webp';
  }
}