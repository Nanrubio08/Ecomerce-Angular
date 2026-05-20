import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  form = this.fb.group({
    username:    ['', [Validators.required]],
    password:    ['', [Validators.required, Validators.minLength(6)]]
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

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al registrar';
        this.loading = false;
      }
    });
  }
}
