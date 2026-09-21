import { Component, inject, OnInit } from '@angular/core';
import { CreditService } from '../../../../core/services/credit.service';

@Component({
  selector: 'app-verify-payment',
  imports: [],
  templateUrl: './verify-payment.html',
  styleUrl: './verify-payment.css',
})
export class VerifyPayment implements OnInit {
  creditService = inject(CreditService)
  ngOnInit() {
    this.creditService.verifyTransaction(window.location.search.split('reference=')[1]).subscribe()
    window.close();
  }
}
