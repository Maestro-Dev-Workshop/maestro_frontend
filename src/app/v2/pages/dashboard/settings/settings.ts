import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  imports: [Header, DashboardSidebar, ThemeIconComponent, CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private router = inject(Router);
  themeService = inject(ThemeService);

  // Mock data for functionality
  firstName = 'John';
  lastName = 'Doe';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  viewDetails() {
    this.router.navigate(['/v2/usage-stats']);
  }

  savePersonalInfo() {
    // Mock save logic
    console.log('Saving:', this.firstName, this.lastName);
  }

  savePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Password changed');
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
