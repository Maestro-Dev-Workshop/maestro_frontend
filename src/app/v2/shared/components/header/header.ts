import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { ThemeService } from '../../../../core/services/theme.service';
import { CreditService } from '../../../../core/services/credit.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [ThemeIconComponent, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  initials = signal<string>("EE")
  credits = signal(0)
  reloadTrigger = input(0)

  authService = inject(AuthService)
  creditService = inject(CreditService)
  themeService = inject(ThemeService)
  currentTheme = this.themeService.getTheme()

  constructor() {
    effect(() => {
      this.reloadTrigger();
  
      // Re-fetch data / reset state / whatever needs reloading
      this.creditService.getBalance().subscribe({
        next: (response) => {
          this.credits.set(
            Number(response.balance.membership_credits) + Number(response.balance.topup_credits)
          );
        }
      })
    });
  }

  toggleTheme() {
    if (this.currentTheme === 'dark') {
      this.themeService.setTheme('light');
    } else {
      this.themeService.setTheme('dark');
    }
    this.currentTheme = this.themeService.getTheme();
  }

  ngOnInit() {
    this.creditService.getBalance().subscribe({
      next: (response) => {
        this.credits.set(
          Number(response.balance.membership_credits) + Number(response.balance.topup_credits)
        );
      }
    })

    this.authService.getUserDetails().subscribe({
      next: (response) => {
        this.initials.set(response.user.first_name.slice(0,1) + response.user.last_name.slice(0,1));
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    })
  }
}
