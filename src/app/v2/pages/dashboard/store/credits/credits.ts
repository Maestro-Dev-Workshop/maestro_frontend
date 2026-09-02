import { Component, inject, OnInit, signal } from '@angular/core';
import { ThemeIconComponent } from '../../../../../shared/components/theme-icon/theme-icon';
import { ShinyBtnComponent } from '../../../../shared/components/shiny-btn/shiny-btn';
import { CreditService } from '../../../../../core/services/credit.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CreditPack } from '../../../../../core/models/credit.model';
import { CurrencyLocalizerPipe } from '../../../../../shared/pipes/currency-localizer-pipe';
import { CommonModule, DecimalPipe } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../../../environments/environment';
import { UserModel } from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-credits',
  imports: [ThemeIconComponent, ShinyBtnComponent, CurrencyLocalizerPipe, CommonModule, DecimalPipe],
  templateUrl: './credits.html',
  styleUrl: './credits.css',
})
export class Credits implements OnInit {
  loading = {
    status: signal(true),
    text: signal('Loading credit packs...'),
  }
  socket!: Socket;

  creditPacks = signal<any[]>([]);

  creditPackTemplate = {
    id: 'id',
    credits: 'credits',
    price: 'price',
    desc: 'description',
    oldPrice: 'oldPrice',
    bonusCredits: 'bonusCredits',
    discount: 'discount',
  }

  packs = signal<CreditPack[]>([])
  user = signal<UserModel | null>(null)
  countryCode = signal('US')

  creditService = inject(CreditService)
  authService = inject(AuthService)
  notify = inject(NotificationService)

  ngOnInit() {
    this.creditService.getPacks().subscribe({
      next: (response) => {
        this.packs.set(response.packs)
        this.countryCode.set(response.country_code);
        this.loadCreditPacks();
        this.loading.status.set(false);
      },
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to load credit packs. Please try again later.");
        this.loading.status.set(false);
      }
    });

    this.authService.getUserDetails().subscribe({
      next: (response) => {
        this.user.set(response.user);
      },
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to load user details. Please try again later.");
      }
    });
  }

  private loadCreditPacks() {
    const packs = this.packs();
    const mappedPacks = packs.map(pack => {
      return {
        id: pack.id,
        credits: pack.credits,
        price: pack.discount 
        ? (pack.display_price * (1 - pack.discount / 100))
        : pack.display_price,
        oldPrice: pack.display_price,
        bonusCredits: pack.bonus_credits,
        discount: pack.discount,
        desc: pack.description,
      };
    });
    this.creditPacks.set(mappedPacks);
  }

  purchaseCreditPack(packId: string) {
    this.loading.status.set(true);
    this.loading.text.set('Redirecting to payment gateway...');

    this.creditService.purchasePack(packId, null).subscribe({
      next: (response) => {
        window.open(response.transaction.authorization_url, '_blank');
        this.loading.status.set(false);

        this.socket = io(environment.apiUrl.slice(0, -4), {
          withCredentials: true
        });
    
        this.socket.emit("join-email-room", this.user()?.email);
      
        this.socket.on("credits-purchased", (data) => {
          this.notify.showSuccess(`Successfully purchased ${data.credits} credits.`);
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        });

        this.socket.on("credit-purchase-failed", () => {
          this.notify.showError("Payment failed. Please try again.");
        });
      },
      error: (err) => {
        this.notify.showError(err.error.message || "Failed to initiate credit purchase. Please try again.");
        this.loading.status.set(false);
      }
    });
  }
}
