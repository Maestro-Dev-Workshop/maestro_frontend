import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail {
  verified = false;
  authService = inject(AuthService);

  constructor(private router: Router) {
    // Extract token from URL query params then call verifyEmail
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (response) => {
          console.log('Email verification successful', response);
          this.verified = true;
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          console.error('Email verification failed', error);
          alert('Email verification failed, Please try again.');
          this.router.navigateByUrl('/signup');
        }
      });
    } else {
      alert('Invalid verification link.');
      this.router.navigateByUrl('/signup');
    }
  }
}
