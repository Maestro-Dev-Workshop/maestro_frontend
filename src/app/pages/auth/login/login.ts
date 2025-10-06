import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import
import { environment } from '../../../../environments/environment';

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
  authService = inject(AuthService);
  notify = inject(NotificationService); // <-- Inject notification service
  allowedEmails: Array<String> = [
    "ewuoso03@gmail.com",
    "xlegend1251@gmail.com",
    "Adebawojomosope@gmail.com",
    "maestroaidevs@gmail.com",
    "mosopekushimo@gmail.com",
    "tobiraph09@gmail.com",
    "trust.okpokpo@gmail.com",
    "tunjitanny25@gmail.com",
    "everlast666666666@gmail.com",
  ];

  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
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
      this.notify.showError("Valid email and password required");
      this.loading = false;
    } else if (environment.beta && this.allowedEmails.length > 0 && !this.allowedEmails.includes(this.email)) {
      this.notify.showError("This email is not authorized for login on beta.");
      this.loading = false;
    } else {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          const user = response.user;
          console.log('Logged in user:', user);
          localStorage.setItem('userEmail', user.email);
          this.loading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          console.error('Login failed', error);
          this.notify.showError('Invalid email or password');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
