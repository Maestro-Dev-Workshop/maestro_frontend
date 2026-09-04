import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { StandardBtn } from '../../../shared/components/standard-btn/standard-btn';

@Component({
  selector: 'app-settings',
  imports: [
    Header,
    DashboardSidebar,
    ThemeIconComponent,
    CommonModule,
    FormsModule,
    StandardBtn
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  themeService = inject(ThemeService);
  notify = inject(NotificationService)

  // Mock data for functionality
  email = 'john.doe@gmail.com'
  firstName = 'John';
  lastName = 'Doe';
  currntFirstName = ''
  currentLastName = ''
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  membershipTier = 'Free Tier'

  // UI State
  isEditingName = signal(false);
  showPasswordFields = signal(false);

  constructor (
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.getUserDetails().subscribe({
      next: (response) => {
        this.firstName = response.user.first_name;
        this.lastName = response.user.last_name;
        this.email = response.user.email;
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  viewDetails() {
    this.router.navigate(['/v2/usage-stats']);
  }

  toggleNameEdit() {
    this.isEditingName.set(!this.isEditingName());
    if (this.isEditingName()) {
      this.currntFirstName = this.firstName
      this.currentLastName = this.lastName
    }
  }

  canSaveName() {
    return this.firstName !== this.currntFirstName || this.lastName !== this.currentLastName;
  }

  savePersonalInfo() {
    if (this.canSaveName()) {
      // Mock save logic
      console.log('Saving:', this.firstName, this.lastName);
      this.isEditingName.set(false);
    }
  }

  cancelNameEdit() {
    this.firstName = this.currntFirstName
    this.lastName = this.currentLastName
    this.isEditingName.set(false);
  }

  togglePasswordFields() {
    this.showPasswordFields.set(!this.showPasswordFields());
  }

  savePassword() {
    if (!this.currentPassword) {
      this.notify.showError('Current password is required');
      return;
    }
    if (this.newPassword.length < 8) {
      this.notify.showError('New password must be at least 8 characters');
      return;
    }
    if (this.newPassword === this.currentPassword) {
      this.notify.showError('New password must be different from current password');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.notify.showError('Passwords do not match');
      return;
    }
    // Mock API call
    this.notify.showSuccess('Password changed successfully');
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showPasswordFields.set(false);
  }
}
