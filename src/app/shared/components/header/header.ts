import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Confirmation } from '../confirmation/confirmation';
import { SubscriptionService } from '../../../core/services/subscription.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, Confirmation],
  templateUrl: './header.html'
})
export class Header implements OnInit {
  pageLoading = false;
  showLogout = signal(false);
  showAccount = signal(false);
  email = signal(localStorage.getItem("userEmail"));

  subjectsCreated = signal (0);
  subjectsTotal = signal (10);

  subscriptionService = inject(SubscriptionService);

  subjectPercent = computed (() => {
    return (this.subjectsCreated() / this.subjectsTotal()) * 100;
  });

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscription().subscribe((data) => {
      if (data && data.plan) {
        this.subjectsTotal.set(data.plan.monthly_subject_creations);
        this.subjectsCreated.set(data.subjects_created_this_month);
      }
    });
  }

  openLogout() { this.showLogout.set(true); }
  cancelLogout() { this.showLogout.set(false); }
  confirmLogout() {
    this.auth.logout();
    this.showLogout.set(false);
    this.router.navigateByUrl('/');
  }

  popout() {
    this.showAccount.set(!this.showAccount());
  }

  // Navigate to Subscription Page
  goToUpgrade() {
    this.pageLoading = true;
    this.showAccount.set(false);
    setTimeout(() => {
      this.router.navigateByUrl('dashboard/subscription');
    }, 400);
  }
}