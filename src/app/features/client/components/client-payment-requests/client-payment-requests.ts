import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientService, DashboardStats } from '../../services/client.service';
import { ClientPaymentRequest } from '../../models/client-payment-request.model';
import { BankAccount } from '../../models/bank-account.model';

@Component({
  selector: 'app-client-payment-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-payment-requests.html',
  styleUrls: ['./client-payment-requests.css']
})
export class ClientPaymentRequests implements OnInit {
  paymentRequests: ClientPaymentRequest[] = [];
  stats: DashboardStats = { totalRequests: 0, pending: 0, accepted: 0, paid: 0, failed: 0, rejected: 0 };
  bankAccounts: BankAccount[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    forkJoin({
      accounts: this.clientService.getClientBankAccounts().pipe(catchError(() => of([]))),
      requests: this.clientService.getPaymentHistory().pipe(catchError(() => of([]))),
      stats: this.clientService.getDashboardStats().pipe(catchError(() => of(this.stats)))
    }).subscribe(({ accounts, requests, stats }) => {
      this.bankAccounts = accounts ?? [];
      this.paymentRequests = (requests ?? []).filter(r => r.status === 'PENDING');
      this.stats = stats;
      this.isLoading = false;
    });
  }

  refresh(): void { this.loadDashboardData(); }

  acceptRequest(request: ClientPaymentRequest): void {
    if (!request.clientBankAccountId) {
      this.errorMessage = 'Select a bank account before accepting.';
      return;
    }

    this.clientService.acceptRequest(request.id, request.clientBankAccountId)
      .pipe(catchError(err => { this.errorMessage = err.message; return of(null); }))
      .subscribe(res => {
        if (res) {
          this.paymentRequests = this.paymentRequests.filter(r => r.id !== request.id);
          this.updateStats();
        }
      });
  }

  rejectRequest(request: ClientPaymentRequest): void {
    this.clientService.rejectRequest(request.id)
      .pipe(catchError(err => { this.errorMessage = err.message; return of(null); }))
      .subscribe(res => {
        if (res) {
          this.paymentRequests = this.paymentRequests.filter(r => r.id !== request.id);
          this.updateStats();
        }
      });
  }

  private updateStats(): void {
    this.clientService.getDashboardStats().subscribe({ next: stats => this.stats = stats });
  }
}
