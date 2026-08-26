import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [
    Header,
    DashboardSidebar,
    ThemeIconComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private router = inject(Router);
  private authService = inject(AuthService);
  themeService = inject(ThemeService);

  // Mock data for functionality
  firstName = 'John';
  lastName = 'Doe';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // UI State
  isEditingName = false;
  showPasswordFields = false;

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
    this.isEditingName = !this.isEditingName;
    if (!this.isEditingName) {
      this.firstName = 'John';
      this.lastName = 'Doe';
    }
  }

  canSaveName() {
    return this.firstName !== 'John' || this.lastName !== 'Doe';
  }

  savePersonalInfo() {
    if (this.canSaveName()) {
      // Mock save logic
      console.log('Saving:', this.firstName, this.lastName);
      this.isEditingName = false;
    }
  }

  cancelNameEdit() {
    this.firstName = 'John';
    this.lastName = 'Doe';
    this.isEditingName = false;
  }

  togglePasswordFields() {
    this.showPasswordFields = !this.showPasswordFields;
  }

  savePassword() {
    if (!this.currentPassword) {
      alert('Current password is required');
      return;
    }
    if (this.newPassword.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }
    if (this.newPassword === this.currentPassword) {
      alert('New password must be different from current password');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Mock API call
    console.log('Password changed successfully');
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showPasswordFields = false;
  }
}
