
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentHistoryService } from '../../services/payment-history.service';
import { ClientPaymentRequest, PaymentStatus } from '../../models/client-payment-request';

@Component({
  selector: 'app-client-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-payment-history.html',
  styleUrls: ['./client-payment-history.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientPaymentHistoryComponent implements OnInit {

  paymentHistory: ClientPaymentRequest[] = [];
  loading = false;
  errorMessage = '';
  lastUpdated: Date = new Date();

  // Filters
  startDate?: string;
  endDate?: string;
  status?: PaymentStatus | '';

  constructor(private paymentService: PaymentHistoryService) {}

  ngOnInit(): void {
    this.fetchPaymentHistory();
  }

  fetchPaymentHistory(): void {
    this.loading = true;
    this.errorMessage = '';

    this.paymentService.getPaymentHistory(
      this.startDate,
      this.endDate,
      this.status || undefined
    ).subscribe({
      next: data => {
        // Ensure createdAt and acceptedAt are present and ISO strings
        this.paymentHistory = data.map(req => ({
          ...req,
          createdAt: req.createdAt ? new Date(req.createdAt).toISOString() : new Date().toISOString(),
          acceptedAt: req.acceptedAt ? new Date(req.acceptedAt).toISOString() : undefined
        }));
        this.lastUpdated = new Date();
      },
      error: err => {
        console.error('Error fetching payment history', err);
        this.errorMessage = 'Failed to fetch payment history. Please try again later.';
        this.paymentHistory = [];
      },
      complete: () => this.loading = false
    });
  }

  getStatusClass(status: PaymentStatus): string {
    switch (status) {
      case 'ACCEPTED': return 'status-accepted';
      case 'PENDING': return 'status-pending';
      //case 'PAID': return 'status-paid';
      //case 'FAILED': return 'status-failed';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-default';
    }
  }

  getTotalAmount(): number {
    return this.paymentHistory.reduce((total, req) => total + req.amount, 0);
  }

  getStatusCount(status: PaymentStatus): number {
    return this.paymentHistory.filter(req => req.status === status).length;
  }
}
