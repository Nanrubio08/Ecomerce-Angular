import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilPageComponent implements OnInit {
  form = this.fb.group({
    username: [{ value: '', disabled: true }, Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    password: [''] 
  });

  editMode = false;
  clienteId = '';
  fechaRegistro = '';

  @ViewChild('toastElement', { static: false }) toastElement!: ElementRef;

 constructor(
  private fb: NonNullableFormBuilder,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

 ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const raw = localStorage.getItem('cliente');
    if (raw) {
      const user = JSON.parse(raw);
      this.clienteId = user.id || user._id || '';
      this.fechaRegistro = user.fechaRegistro || new Date().toISOString();

      this.form.patchValue({
        username: user.username || user.nombre || 'Usuario',
        email: user.email || user.correo || ''
      });
    }
  }
}

  toggleEdit(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.form.enable();
    } else {
      this.form.disable();
      this.form.get('password')?.reset();
    }
  }

onSubmit(): void {
  if (this.form.invalid || !this.clienteId) return;

  const payload = { ...this.form.getRawValue() };

  if (!payload.password || payload.password.trim() === '') {
    delete (payload as any).password;
  }

  localStorage.setItem('cliente', JSON.stringify({ ...payload, id: this.clienteId }));
  this.toggleEdit();

  if (isPlatformBrowser(this.platformId)) {
    import('bootstrap').then(({ Toast }) => {
      const toast = new Toast(this.toastElement.nativeElement);
      toast.show();
    });
  }
}
}