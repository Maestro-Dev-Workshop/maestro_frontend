import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);

  verified = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');

      if (token) {
        this.verifyToken(token);
      } else {
        this.notify.showError('Invalid verification link.');
        this.router.navigateByUrl('/signup');
      }
    });
  }

  private verifyToken(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.verified.set(true);
        setTimeout(() => {
          window.close();
        }, 1000);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Email verification failed. Please try again.');
        this.router.navigateByUrl('/signup');
      },
    });
  }
}
