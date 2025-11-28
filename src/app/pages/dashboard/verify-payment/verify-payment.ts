import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-payment',
  imports: [],
  templateUrl: './verify-payment.html',
  styleUrl: './verify-payment.css',
})
export class VerifyPayment implements OnInit {
  ngOnInit(): void {
      window.close();
  }
}
