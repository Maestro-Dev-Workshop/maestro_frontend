import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ConfirmService } from '../../../core/services/confirm';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html'
})
export class Header implements OnInit {

  pageLoading = false;

  showLogout = signal(false);
  showAccount = signal(false);

  email = signal(localStorage.getItem('userEmail'));

  planName = signal('Free Plan');
  subjectsCreated = signal(0);
  subjectsTotal = signal(10);

  subscriptionService = inject(SubscriptionService);
  confirmation = inject(ConfirmService);
  themeService = inject(ThemeService);

  subjectPercent = computed(() => {
    return (this.subjectsCreated() / this.subjectsTotal()) * 100;
  });

  currentTheme = this.themeService.getTheme();

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeService.init();
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.subjectsCreated.set(
          response.subscription.subjects_created_this_month
        );
        this.subjectsTotal.set(
          response.subscription.plan.monthly_subject_creations
        );
        this.planName.set(response.subscription.plan.name);
        this.cdr.detectChanges();
      }
    });
  }

  popout() {
    this.showAccount.set(!this.showAccount());
  }

  setTheme(mode: ThemeMode) {
    this.themeService.setTheme(mode);
    this.currentTheme = this.themeService.getTheme();
    this.cdr.detectChanges();
  }

  openLogout() {
    this.confirmation
      .open({
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        okText: 'Logout',
        cancelText: 'Cancel'
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.confirmLogout();
        }
      });
  }

  confirmLogout() {
    this.auth.logout();
    this.showLogout.set(false);
    this.router.navigateByUrl('/');
  }

  goToUpgrade() {
    this.showAccount.set(false);
    this.router.navigateByUrl('dashboard/subscription');
  }
}
