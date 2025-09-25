import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmLogout } from '../confirm-logout/confirm-logout';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ConfirmLogout],
  templateUrl: './header.html'
})
export class Header {
  showLogout = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  openLogout() { this.showLogout.set(true); }
  cancelLogout() { this.showLogout.set(false); }
  confirmLogout() {
    this.auth.logout();
    this.showLogout.set(false);
    this.router.navigateByUrl('/login');
  }
}