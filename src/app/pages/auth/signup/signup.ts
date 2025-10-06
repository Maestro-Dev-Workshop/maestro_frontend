import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../../shared/directives/password-validator';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';

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
    // Later: replace with real API call
    if (this.emailCtrl.invalid || this.passwordCtrl.invalid || this.firstnameCtrl.invalid || this.lastnameCtrl.invalid) {
      this.notify.showError("first name, last name, valid email, and valid password are required");
      this.loading = false;
    } else if (environment.beta && this.allowedEmails.length > 0 && !this.allowedEmails.includes(this.email)) {
      this.notify.showError("This email is not authorized for signup on beta.");
      this.loading = false;
    } else {
      this.authService.signup({ 
        first_name: this.firstname, last_name: this.lastname, email: this.email, password: this.password }).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.notify.showSuccess('Signup successful! Please log in.');
          this.loading = false;
          this.router.navigateByUrl('/check-email', { state: { email: this.email } });
        },
        error: (error) => {
          console.error('Signup failed', error);
          this.notify.showError('Signup failed, Please try again.');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
