import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail {
  verified = false;
  authService = inject(AuthService);
  notify = inject(NotificationService);

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Extract token from URL query params then call verifyEmail
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      this.authService.verifyEmail(token || '').subscribe({
        next: (response) => {
          this.verified = true;
          this.cdr.detectChanges();
          // Close this tab after a short delay
          setTimeout(() => {
            window.close();
          }, 1000);
        },
        error: (res) => {
          this.notify.showError(res.error.message || 'Email verification failed. Please try again.');
          this.router.navigateByUrl('/signup');
        }
      });
    } else {
      this.notify.showError('Invalid verification link.');
      this.router.navigateByUrl('/signup');
    }
  }
}
