import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Plan, SubscriptionStatus } from '../../../core/models/subscription.model';
import { NotificationService } from '../../../core/services/notification.service';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, RouterLink],
  templateUrl: './subscription.html'
})
export class Subscription implements OnInit {
  pageLoading = true
  loadText = 'Loading subscription details...';
  socket!: Socket;

  // --------------------------
  // USER PROFILE SIGNALS
  // --------------------------
  firstname = signal('');
  lastname = signal('');
  email = signal('');
  showMobileMenu = false;


  // --------------------------
  // SUBSCRIPTION SIGNALS
  // --------------------------
  plans = signal<Plan[]>([]);
  status = signal<SubscriptionStatus | null>(null);

  activeTab = signal<'account' | 'billing'>('billing');

  // --------------------------
  // USAGE DATA (Make dynamic later)
  // --------------------------
  generatedLessons = 1;
  generatedLimit = 2;
  savedLessons = 3;
  savedLimit = 5;

  // --------------------------
  // DONUT DRAW SETTINGS
  // --------------------------
  outerRadius = 80;
  innerRadius = 55;

  outerCircumference = 2 * Math.PI * this.outerRadius;
  innerCircumference = 2 * Math.PI * this.innerRadius;

  // STRING values (required by Angular 20 for SVG)
  outerDashArray = '';
  outerDashOffset = '';
  innerDashArray = '';
  innerDashOffset = '';

  constructor(
    private subscriptionService: SubscriptionService,
    private notify: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.firstname.set(localStorage.getItem('firstname') || '');
    this.lastname.set(localStorage.getItem('lastname') || '');
    this.email.set(localStorage.getItem('userEmail') || '');

    this.subscriptionService.getPlans().subscribe({
      next: (response) => {
        this.plans.set(response.plans)
      }, 
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to load subscription plans. Please try again later.");
      }
    });

    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.status.set(response.subscription);

        this.generatedLessons = this.status()?.subjects_created_this_month || 0
        this.generatedLimit = this.status()?.plan?.monthly_subject_creations || 0
        this.savedLessons = this.status()?.total_subjects_created || 0
        this.savedLimit = this.status()?.plan?.subject_capacity || 0

        this.calculateUsage();
        this.pageLoading = false;
      },
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to load subscription status. Please try again later.");
        this.pageLoading = false;
      },
      complete: () => {
        this.pageLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.calculateUsage();
  }

  openTab(tab: 'account' | 'billing') {
    this.activeTab.set(tab);
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  // saveProfile() {
  //   localStorage.setItem('firstname', this.firstname());
  //   localStorage.setItem('lastname', this.lastname());
  //   localStorage.setItem('userEmail', this.email());
  //   alert("Profile saved!");
  // }

  // --------------------------
  // DONUT CALCULATION
  // --------------------------
  calculateUsage() {
    const used = this.generatedLessons || 0;
    const max = this.generatedLimit || 1;
    const saved = this.savedLessons || 0;
    const savedLimit = this.savedLimit || 1;

    // OUTER RING — lesson generation
    const outerPercent = Math.min(used / max, 1);
    this.outerDashArray = `${this.outerCircumference * outerPercent} ${this.outerCircumference * (1 - outerPercent)}`;
    this.outerDashOffset = `${this.outerCircumference * outerPercent}`;

    // INNER RING — saved lessons
    const innerPercent = Math.min(saved / savedLimit, 1);
    this.innerDashArray = `${this.innerCircumference * innerPercent} ${this.innerCircumference * (1 - innerPercent)}`;
    this.innerDashOffset = `${this.innerCircumference * innerPercent}`;
  }

  switchPlan(planCode: string) {
    this.pageLoading = true;
    if (planCode == "free2play") {
      this.loadText = "Cancelling subscription...";
      this.subscriptionService.cancel().subscribe({
        next: (response) => {
          this.notify.showSuccess("Subscription cancelled successfully.");
          window.location.reload();
        },
        error: (err) => {
          this.notify.showError(err.error.message || "Failed to cancel subscription. Please try again later.");
        },
        complete: () => {
          this.pageLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loadText = "Redirecting to payment gateway...";
      this.subscriptionService.subscribe(planCode).subscribe({
        next: (response) => {
          window.open(response.transaction.authorization_url, '_blank');
          this.pageLoading = false;
          this.cdr.detectChanges();

          this.socket = io(environment.apiUrl.slice(0, -4), {
            withCredentials: true
          });
      
          this.socket.emit("join-email-room", this.email());
        
          this.socket.on("payment-successful", () => {
            this.notify.showSuccess("Payment successfully processed.");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
              
          });

          this.socket.on("payment-failed", () => {
            this.notify.showError("Payment failed. Please try again.");
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.notify.showError(err.error.message || "Failed to initiate subscription. Please try again later.");
          this.pageLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
