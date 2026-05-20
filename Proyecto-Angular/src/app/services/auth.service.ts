// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('cliente', JSON.stringify(response.user));
        }),
        catchError(err => throwError(() => err))
      );
  }

  register(data: {
    username: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/register`, data)
      .pipe(
        tap(response => localStorage.setItem('token', response.token)),
        catchError(err => throwError(() => err))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('cliente');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
