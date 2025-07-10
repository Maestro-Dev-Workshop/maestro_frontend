import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService }  from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  firstName = '';
  lastName  = '';
  email     = '';
  password  = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onNext() {
    this.auth.signup({
      firstName: this.firstName,
      lastName:  this.lastName,
      email:     this.email,
      password:  this.password
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => alert('Signup failed. Please try again.')
    });
  }
}