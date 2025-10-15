import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService, PaymentStatus } from '../../services/client.service';
import { ClientPaymentRequest } from '../../models/client-payment-request.model';

@Component({
  selector: 'app-client-payment-history',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule],
  templateUrl: './client-payment-history.html',
  styleUrls: ['./client-payment-history.css']
})
export class ClientPaymentHistory implements OnInit {
  paymentHistory: ClientPaymentRequest[] = [];
  startDate?: string;
  endDate?: string;
  status?: PaymentStatus;
  errorMessage = '';
  isLoading = false;

  private validStatuses: PaymentStatus[] = ['PENDING', 'ACCEPTED', 'REJECTED'];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.fetchPaymentHistory();
  }

  fetchPaymentHistory(): void {
    this.isLoading = true;
    let normalizedStatus: PaymentStatus | undefined;

    if (this.status) {
      const upperStatus = this.status.trim().toUpperCase() as PaymentStatus;
      if (this.validStatuses.includes(upperStatus)) normalizedStatus = upperStatus;
      else console.warn(`Invalid status filter: ${this.status}`);
    }

    this.clientService.getPaymentHistory(this.startDate, this.endDate, normalizedStatus)
      .subscribe({
        next: res => { this.paymentHistory = res; this.isLoading = false; },
        error: err => { this.errorMessage = err.message; this.isLoading = false; }
      });
  }
}
