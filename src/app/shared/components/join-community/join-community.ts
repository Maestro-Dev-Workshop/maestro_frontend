import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-join-community',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-community.html',
})
export class JoinCommunityComponent {
  whatsappUrl = 'https://chat.whatsapp.com/IaR3ER6Zz7KFzbi4R9wKAi';
  discordUrl = 'https://discord.gg/FNawhhghKC';

  showPopup = false;

  togglePopup(): void {
    this.showPopup = !this.showPopup;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  joinWhatsapp(): void {
    window.open(this.whatsappUrl, '_blank');
  }

  joinDiscord(): void {
    window.open(this.discordUrl, '_blank');
  }
}
