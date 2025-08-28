import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  passwordVisible = "password";
  loading = false;

  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;

  authService = inject(AuthService);
  constructor(
    private router: Router,
  ) {}

  togglePasswordVisibility() {
    if (this.passwordVisible === "password") {
      this.passwordVisible = "text"
    } else {
      this.passwordVisible = "password"
    }
  }

  onSubmit() {
    this.loading = true;
    // Later: replace with real API call
    if (this.emailCtrl.invalid || this.passwordCtrl.invalid) {
      alert("Valid email and password required");
    } else {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          const user = response.user;
          console.log('Logged in user:', user);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Invalid email or password');
        }
      });
    }
    this.loading = false;
  }
}
