import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../../shared/directives/password-validator';
import { AuthService } from '../../../core/services/auth.service';

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
  
  @ViewChild('firstnameCtrl') firstnameCtrl!: NgModel;
  @ViewChild('lastnameCtrl') lastnameCtrl!: NgModel;
  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;

  constructor(private router: Router) {}

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
      alert("first name, last name, valid email, and valid password are required");
    } else {
      this.authService.signup({ 
        first_name: this.firstname, last_name: this.lastname, email: this.email, password: this.password }).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          alert('Signup successful! Please log in.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed', error);
          alert('Signup failed, Please try again.');
        }
      });
    }
    this.loading = false;
  }
}
