import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  imports: [],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  title = input.required<string>();
  message = input<string>("Are you sure?");
  acceptText = input<string>("Yes");
  cancelText = input<string>("No");
}
