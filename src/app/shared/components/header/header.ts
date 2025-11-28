import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
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

  planName = signal('Free Plan')
  subjectsCreated = signal (0);
  subjectsTotal = signal (10);

  subscriptionService = inject(SubscriptionService);

  subjectPercent = computed (() => {
    return (this.subjectsCreated() / this.subjectsTotal()) * 100;
  });

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.subjectsCreated.set(response.subscription.subjects_created_this_month);
        this.subjectsTotal.set(response.subscription.plan.monthly_subject_creations);
        this.planName.set(response.subscription.plan.name);
        this.cdr.detectChanges();
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
    this.showAccount.set(false);
    this.router.navigateByUrl('dashboard/subscription');
  }
}