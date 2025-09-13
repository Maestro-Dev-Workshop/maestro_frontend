import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-logout',
  imports: [CommonModule],
  templateUrl: './confirm-logout.html',
  styleUrl: './confirm-logout.css'
})
export class ConfirmLogout {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
