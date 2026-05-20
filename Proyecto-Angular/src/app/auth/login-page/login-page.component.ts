import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  loading = false;
  errorMsg = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();
    this.loading = true;
    this.errorMsg = '';

    this.auth.login(payload).subscribe({
      next: () => {
        // ✅ AuthService.login() ya guarda token y cliente en localStorage via tap()
        // No se duplica la lógica aquí
        this.loading = false; // ✅ Resetear loading antes de navegar
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}
