import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);


  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.auth.login(this.form.value as { email: string; password: string }).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
  goToSignUp() {
    this.router.navigate(['/auth/signup']);
  }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}