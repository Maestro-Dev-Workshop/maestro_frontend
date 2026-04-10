import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-join-community',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-community.html',
})
export class JoinCommunityComponent {
  @Input() whatsappUrl = 'https://chat.whatsapp.com/wetin_be_link_';
  @Input() discordUrl = 'https://discord.gg/wetin_be_link_';

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
