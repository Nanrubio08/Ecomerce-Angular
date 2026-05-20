// src/app/services/producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '../interfaces/producto.interface';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl)
      .pipe(catchError(err => throwError(() => err)));
  }

  crearProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto)
      .pipe(catchError(err => throwError(() => err)));
  }
}
