import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

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
    if (this.emailCtrl.invalid || this.passwordCtrl.invalid) {
      alert("Valid email and password required");
    } else {
      if (this.email === 'test@example.com' && this.password === 'password') {
        console.log('Login successful');
        this.router.navigate(['/dashboard']);
      } else {
        console.log('Invalid credentials');
        alert('Invalid email or password');
      }
    }
    this.loading = false;
  }
}
