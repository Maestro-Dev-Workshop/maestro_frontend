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
    if (this.emailCtrl.invalid || this.passwordCtrl.invalid || this.firstnameCtrl.invalid || this.lastnameCtrl.invalid) {
      this.notify.showError("first name, last name, valid email, and valid password are required");
      this.loading = false;
    } else {
      this.authService.signup({ 
        first_name: this.firstname, last_name: this.lastname, email: this.email.toLowerCase(), password: this.password }).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.notify.showSuccess('Signup successful! Please log in.');
          this.loading = false;
          this.router.navigateByUrl('/check-email', { state: { email: this.email.toLowerCase() } });
        },
        error: (res) => {
          console.error('Signup failed', res);
          this.notify.showError(res.error.message || 'Signup failed. Please try again.');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
