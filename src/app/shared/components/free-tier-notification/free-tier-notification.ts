import { Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-free-tier-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './free-tier-notification.html',
  styleUrl: './free-tier-notification.css',
})
export class FreeTierNotification {
  @Output() closed = new EventEmitter<boolean>();
  @Output() getAccess = new EventEmitter<void>();

  dontShowAgain = false;


  onClose() {
    this.closed.emit(this.dontShowAgain);
  }

  onGetAccess() {
    this.getAccess.emit();
  }

}
