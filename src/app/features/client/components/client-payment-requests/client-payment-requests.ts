
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { forkJoin, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { ClientService, DashboardStats } from '../../services/client.service';
// import { ClientPaymentRequest } from '../../models/client-payment-request.model';
// import { BankAccount } from '../../models/bank-account.model';

// @Component({
//   selector: 'app-client-payment-requests',
//   templateUrl: './client-payment-requests.html',
//   styleUrls: ['./client-payment-requests.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule]
// })
// export class ClientPaymentRequests implements OnInit {
//   clientId = 0;
//   paymentRequests: ClientPaymentRequest[] = [];
//   stats: DashboardStats = {
//     totalRequests: 0,
//     pending: 0,
//     accepted: 0,
//     paid: 0,
//     failed: 0,
//     rejected: 0
//   };
//   bankAccounts: BankAccount[] = [];
//   isLoading = false;
//   errorMessage = '';

//   constructor(private clientService: ClientService) {}

//   ngOnInit(): void {
//     this.loadClientIdFromCookie();
//     if (this.clientId > 0) {
//       this.loadDashboardData();
//     } else {
//       this.errorMessage = 'Invalid client ID. Please log in again.';
//     }
//   }

  
//   private loadClientIdFromCookie(): void {
//     const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
//     if (!match) return;
//     try {
//       const user = JSON.parse(decodeURIComponent(match[2]));
//       this.clientId = user.clientId ?? 0;
//     } catch (err) {
//       console.error('Failed to parse user cookie:', err);
//       this.clientId = 0;
//     }
//   }

  
//   private loadDashboardData(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     forkJoin({
//       accounts: this.clientService.getClientBankAccounts(this.clientId).pipe(
//         catchError(err => {
//           this.errorMessage = 'Failed to fetch bank accounts';
//           return of([]);
//         })
//       ),
//       requests: this.clientService.getPaymentHistory(this.clientId).pipe(
//         catchError(err => {
//           this.errorMessage = 'Failed to fetch payment requests';
//           return of([]);
//         })
//       ),
//       stats: this.clientService.getDashboardStats(this.clientId).pipe(
//         catchError(err => {
//           console.error('Error fetching stats:', err);
//           return of(this.stats);
//         })
//       )
//     }).subscribe(({ accounts, requests, stats }) => {
//       this.bankAccounts = accounts ?? [];

     
//       this.paymentRequests = requests.map(req => ({
//         ...req,
//         clientBankAccounts: req.clientBankAccounts ?? this.bankAccounts
//       }));

//       this.stats = stats;
//       this.isLoading = false;
//     });
//   }

//   refresh(): void {
//     this.loadDashboardData();
//   }


//   acceptRequest(request: ClientPaymentRequest): void {
//     if (!request.clientBankAccountId) {
//       this.errorMessage = 'Please select a bank account before accepting.';
//       return;
//     }

//     this.clientService.acceptRequest(request.id, request.clientBankAccountId).pipe(
//       catchError(err => {
//         this.errorMessage = err.message || 'Failed to accept payment request';
//         return of(null);
//       })
//     ).subscribe(result => {
//       if (result) {
        
//         this.paymentRequests = this.paymentRequests.filter(r => r.id !== request.id);
      
//         this.clientService.getDashboardStats(this.clientId).subscribe({
//           next: stats => this.stats = stats,
//           error: err => console.error('Error updating stats:', err)
//         });
//       }
//     });
//   }
// }









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
  templateUrl: './client-payment-requests.html',
  styleUrls: ['./client-payment-requests.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientPaymentRequests implements OnInit {
  clientId = 0;
  paymentRequests: ClientPaymentRequest[] = [];
  stats: DashboardStats = {
    totalRequests: 0,
    pending: 0,
    accepted: 0,
    paid: 0,
    failed: 0,
    rejected: 0
  };
  bankAccounts: BankAccount[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClientIdFromCookie();
    if (this.clientId > 0) {
      this.loadDashboardData();
    } else {
      this.errorMessage = 'Invalid client ID. Please log in again.';
    }
  }

  private loadClientIdFromCookie(): void {
    const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
    if (!match) return;
    try {
      const user = JSON.parse(decodeURIComponent(match[2]));
      this.clientId = user.clientId ?? 0;
    } catch (err) {
      console.error('Failed to parse user cookie:', err);
      this.clientId = 0;
    }
  }

  /** Load only pending payment requests */
  private loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      accounts: this.clientService.getClientBankAccounts(this.clientId).pipe(
        catchError(err => {
          this.errorMessage = 'Failed to fetch bank accounts';
          return of([]);
        })
      ),
      requests: this.clientService.getPaymentHistory(this.clientId).pipe(
        catchError(err => {
          this.errorMessage = 'Failed to fetch payment requests';
          return of([]);
        })
      ),
      stats: this.clientService.getDashboardStats(this.clientId).pipe(
        catchError(err => {
          console.error('Error fetching stats:', err);
          return of(this.stats);
        })
      )
    }).subscribe(({ accounts, requests, stats }) => {
      this.bankAccounts = accounts ?? [];

      // Only show PENDING requests
      this.paymentRequests = (requests ?? []).filter(r => r.status === 'PENDING');

      this.stats = stats;
      this.isLoading = false;
    });
  }

  refresh(): void {
    this.loadDashboardData();
  }

  acceptRequest(request: ClientPaymentRequest): void {
    if (!request.clientBankAccountId) {
      this.errorMessage = 'Please select a bank account before accepting.';
      return;
    }

    this.clientService.acceptRequest(request.id, request.clientBankAccountId).pipe(
      catchError(err => {
        this.errorMessage = err.message || 'Failed to accept payment request';
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        // Remove accepted request from pending list
        this.paymentRequests = this.paymentRequests.filter(r => r.id !== request.id);

        // Update dashboard stats
        this.clientService.getDashboardStats(this.clientId).subscribe({
          next: stats => this.stats = stats,
          error: err => console.error('Error updating stats:', err)
        });
      }
    });
  }
}
