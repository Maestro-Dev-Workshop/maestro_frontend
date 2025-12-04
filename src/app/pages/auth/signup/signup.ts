import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../../shared/directives/password-validator';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, PasswordValidator],
  templateUrl: './signup.html',
})
export class Signup {
  firstname = "";
  lastname = "";
  email = "";
  password = "";
  passwordVisible = "password";
  loading = false;
  authService = inject(AuthService);
  notify = inject(NotificationService);
  
  @ViewChild('firstnameCtrl') firstnameCtrl!: NgModel;
  @ViewChild('lastnameCtrl') lastnameCtrl!: NgModel;
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
    const errors: string[] = [];
    if (this.firstnameCtrl.invalid) {
      errors.push("First name is required.");
    }
    if (this.lastnameCtrl.invalid) {
      errors.push("Last name is required.");
    }
    if (this.emailCtrl.invalid) {
      errors.push("A valid email is required.");
    }
    if (this.passwordCtrl.invalid) {
      errors.push("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
    }
    if (errors.length > 0) {
      this.notify.showError(errors.join('\n'));
      this.loading = false;
      return;
    } else {
      this.authService.signup({ 
        first_name: this.firstname, last_name: this.lastname, email: this.email.toLowerCase(), password: this.password }).subscribe({
        next: (response) => {
          this.notify.showSuccess('Verification email sent. Please check your inbox.');
          this.loading = false;
          this.router.navigateByUrl('/check-email', { state: { email: this.email.toLowerCase() } });
        },
        error: (res) => {
          this.notify.showError(res.error.message || 'Signup failed. Please try again.');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
