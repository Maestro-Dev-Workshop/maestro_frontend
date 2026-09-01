import { Component, inject, OnInit, signal } from '@angular/core';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';
import { ThemeService } from '../../../../core/services/theme.service';
import { CreditService } from '../../../../core/services/credit.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ThemeIconComponent, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  initials = signal<string>("EE")
  credits = signal(0)

  creditService = inject(CreditService)
  themeService = inject(ThemeService)
  currentTheme = this.themeService.getTheme()

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
  }
}
