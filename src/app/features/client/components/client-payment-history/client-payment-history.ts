import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { ClientPaymentRequest } from '../../models/client-payment-request.model';

@Component({
  selector: 'app-client-payment-history',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule],
  templateUrl: './client-payment-history.html',
  styleUrls: ['./client-payment-history.css']
})
export class ClientPaymentHistoryComponent implements OnInit {
  clientId: number = 0;
  paymentHistory: ClientPaymentRequest[] = [];
  startDate?: string;
  endDate?: string;
  status?: string;
  errorMessage = '';
  isLoading = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClientIdFromCookie();
    this.fetchPaymentHistory();
  }

  private loadClientIdFromCookie(): void {
    const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
    if (match) {
      const user = JSON.parse(decodeURIComponent(match[2]));
      this.clientId = user.clientId || 0;
    }
  }

  fetchPaymentHistory(): void {
    this.isLoading = true;
    this.clientService.getPaymentHistory(this.clientId, this.startDate, this.endDate, this.status).subscribe({
      next: (res) => {
        this.paymentHistory = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to fetch payment history';
        this.isLoading = false;
      }
    });
  }
}
