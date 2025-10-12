// // client-payment-requests.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ClientService, DashboardStats } from '../../services/client.service';
// import { ClientPaymentRequest } from '../../models/client-payment-request.model';

// @Component({
//   selector: 'app-client-payment-requests',
//   standalone: true,
//   imports: [CommonModule, RouterModule, NgIf, NgForOf, AsyncPipe],
//   templateUrl: './client-payment-requests.html',
//   styleUrls: ['./client-payment-requests.css'],
// })
// export class ClientPaymentRequests implements OnInit {
//   clientId: number = 0;
//   paymentRequests: ClientPaymentRequest[] = [];
//   stats: DashboardStats = { totalRequests: 0, pending: 0, accepted: 0, rejected: 0 };
//   isLoading = false;
//   errorMessage = '';

//   constructor(private clientService: ClientService) {}

//   ngOnInit(): void {
//     this.loadClientIdFromCookie();
//     if (this.clientId > 0) {
//       this.loadRequests();
//     } else {
//       this.errorMessage = 'Invalid client ID. Please log in again.';
//     }
//   }

//   // Fetch clientId from cookie
//   private loadClientIdFromCookie(): void {
//     const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
//     if (!match) {
//       this.clientId = 0;
//       return;
//     }
//     try {
//       const user = JSON.parse(decodeURIComponent(match[2]));
//       this.clientId = user.clientId || 0;
//     } catch (err) {
//       console.error('Failed to parse user cookie:', err);
//       this.clientId = 0;
//     }
//   }

//   loadRequests(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.clientService.getPaymentHistory(this.clientId).subscribe({
//       next: (res) => {
//         this.paymentRequests = res;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching payment requests:', err);
//         this.errorMessage = 'Failed to fetch payment requests';
//         this.isLoading = false;
//       },
//     });

//     this.clientService.getDashboardStats(this.clientId).subscribe({
//       next: (res: DashboardStats) => this.stats = res,
//       error: (err) => {
//         console.error('Error fetching stats:', err);
//         this.errorMessage = 'Failed to fetch stats';
//       },
//     });
//   }

//   acceptRequest(requestId: number, clientBankAccountId: number): void {
//     this.clientService.acceptRequest(requestId, clientBankAccountId).subscribe({
//       next: () => {
//         this.paymentRequests = this.paymentRequests.filter(r => r.id !== requestId);
//         this.loadRequests();
//       },
//       error: (err) => {
//         console.error('Error accepting request:', err);
//         this.errorMessage = 'Failed to accept payment request';
//       },
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ClientService, DashboardStats } from '../../services/client.service';
// import { ClientPaymentRequest } from '../../models/client-payment-request.model';

// @Component({
//   selector: 'app-client-payment-requests',
//   standalone: true,
//   imports: [CommonModule, RouterModule, NgIf, NgForOf, AsyncPipe],
//   templateUrl: './client-payment-requests.html',
//   styleUrls: ['./client-payment-requests.css'],
// })
// export class ClientPaymentRequests implements OnInit {
//   clientId: number = 0;
//   paymentRequests: ClientPaymentRequest[] = [];
//   stats: DashboardStats = { totalRequests: 0, pending: 0, accepted: 0, rejected: 0 };
//   isLoading = false;
//   errorMessage = '';

//   constructor(private clientService: ClientService) {}

//   ngOnInit(): void {
//     this.loadClientIdFromCookie();
//     if (this.clientId > 0) {
//       this.loadRequests();
//     } else {
//       this.errorMessage = 'Invalid client ID. Please log in again.';
//     }
//   }

//   private loadClientIdFromCookie(): void {
//     const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
//     if (!match) {
//       this.clientId = 0;
//       return;
//     }
//     try {
//       const user = JSON.parse(decodeURIComponent(match[2]));
//       this.clientId = user.clientId || 0;
//     } catch (err) {
//       console.error('Failed to parse user cookie:', err);
//       this.clientId = 0;
//     }
//   }

//   loadRequests(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.clientService.getPaymentHistory(this.clientId).subscribe({
//       next: (res) => {
//         this.paymentRequests = res;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching payment requests:', err);
//         this.errorMessage = err.message || 'Failed to fetch payment requests';
//         this.isLoading = false;
//       },
//     });

//     this.clientService.getDashboardStats(this.clientId).subscribe({
//       next: (res: DashboardStats) => this.stats = res,
//       error: (err) => {
//         console.error('Error fetching stats:', err);
//         this.errorMessage = err.message || 'Failed to fetch stats';
//       },
//     });
//   }

//   acceptRequest(requestId: number): void {
//     const request = this.paymentRequests.find(r => r.id === requestId);
//     if (!request) return;

//     this.clientService.acceptRequest(requestId, request.clientBankAccountId).subscribe({
//       next: (res) => {
//         console.log('Request accepted:', res);
//         this.paymentRequests = this.paymentRequests.filter(r => r.id !== requestId);

//         this.clientService.getDashboardStats(this.clientId).subscribe({
//           next: (stats) => this.stats = stats,
//           error: (err) => console.error('Error updating stats:', err)
//         });
//       },
//       error: (err) => {
//         console.error('Error accepting request:', err);
//         this.errorMessage = err.message || 'Failed to accept payment request';
//       },
//     });
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ClientService, DashboardStats } from '../../services/client.service';
// import { ClientPaymentRequest } from '../../models/client-payment-request.model';

// @Component({
//   selector: 'app-client-payment-requests',
//   standalone: true,
//   imports: [CommonModule, RouterModule, NgIf, NgForOf, AsyncPipe],
//   templateUrl: './client-payment-requests.html',
//   styleUrls: ['./client-payment-requests.css'],
// })
// export class ClientPaymentRequests implements OnInit {
//   clientId: number = 0;
//   paymentRequests: ClientPaymentRequest[] = [];
//   stats: DashboardStats = { totalRequests: 0, pending: 0, accepted: 0, rejected: 0 };
//   isLoading = false;
//   errorMessage = '';

//   constructor(private clientService: ClientService) {}

//   ngOnInit(): void {
//     this.loadClientIdFromCookie();
//     if (this.clientId > 0) {
//       this.loadRequests();
//     } else {
//       this.errorMessage = 'Invalid client ID. Please log in again.';
//     }
//   }

//   private loadClientIdFromCookie(): void {
//     const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
//     if (!match) {
//       this.clientId = 0;
//       return;
//     }
//     try {
//       const user = JSON.parse(decodeURIComponent(match[2]));
//       this.clientId = user.clientId || 0;
//     } catch (err) {
//       console.error('Failed to parse user cookie:', err);
//       this.clientId = 0;
//     }
//   }

//   loadRequests(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.clientService.getPaymentHistory(this.clientId).subscribe({
//       next: (res) => {
//         this.paymentRequests = res;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching payment requests:', err);
//         this.errorMessage = err.message || 'Failed to fetch payment requests';
//         this.isLoading = false;
//       },
//     });

//     this.clientService.getDashboardStats(this.clientId).subscribe({
//       next: (res: DashboardStats) => this.stats = res,
//       error: (err) => {
//         console.error('Error fetching stats:', err);
//         this.errorMessage = err.message || 'Failed to fetch stats';
//       },
//     });
//   }

//   // Accept payment request
//   acceptRequest(requestId: number): void {
//     this.clientService.acceptRequest(requestId).subscribe({
//       next: (res) => {
//         console.log('Request accepted:', res);
//         this.paymentRequests = this.paymentRequests.filter(r => r.id !== requestId);

//         this.clientService.getDashboardStats(this.clientId).subscribe({
//           next: stats => this.stats = stats,
//           error: err => console.error('Error updating stats:', err)
//         });
//       },
//       error: (err) => {
//         console.error('Error accepting request:', err);
//         this.errorMessage = err.message || 'Failed to accept payment request';
//       },
//     });
//   }
// }




import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientService, DashboardStats } from '../../services/client.service';
import { ClientPaymentRequest } from '../../models/client-payment-request.model';
import { BankAccount } from '../../models/bank-account.model';

@Component({
  selector: 'app-client-payment-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIf, NgForOf, AsyncPipe],
  templateUrl: './client-payment-requests.html',
  styleUrls: ['./client-payment-requests.css'],
})
export class ClientPaymentRequests implements OnInit {
  clientId: number = 0;
  paymentRequests: ClientPaymentRequest[] = [];
  stats: DashboardStats = { totalRequests: 0, pending: 0, accepted: 0, rejected: 0 };
  isLoading = false;
  errorMessage = '';
  bankAccounts: BankAccount[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClientIdFromCookie();
    if (this.clientId > 0) {
      this.loadBankAccounts();
      this.loadRequests();
    } else {
      this.errorMessage = 'Invalid client ID. Please log in again.';
    }
  }

  private loadClientIdFromCookie(): void {
    const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
    if (!match) {
      this.clientId = 0;
      return;
    }
    try {
      const user = JSON.parse(decodeURIComponent(match[2]));
      this.clientId = user.clientId || 0;
    } catch (err) {
      console.error('Failed to parse user cookie:', err);
      this.clientId = 0;
    }
  }

  private loadBankAccounts(): void {
    this.clientService.getClientBankAccounts(this.clientId).subscribe({
      next: (res) => this.bankAccounts = res,
      error: (err) => console.error('Error fetching bank accounts:', err)
    });
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getPaymentHistory(this.clientId).subscribe({
      next: (res) => {
        this.paymentRequests = res;

        // Assign bank accounts to each request for dropdown
        this.paymentRequests.forEach(req => req.clientBankAccounts = this.bankAccounts);

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to fetch payment requests';
        this.isLoading = false;
      },
    });

    this.clientService.getDashboardStats(this.clientId).subscribe({
      next: (res) => this.stats = res,
      error: (err) => {
        this.errorMessage = err.message || 'Failed to fetch stats';
      },
    });
  }

  acceptRequest(request: ClientPaymentRequest): void {
    if (!request.clientBankAccountId) {
      this.errorMessage = 'Please select a bank account before accepting the request.';
      return;
    }

    this.clientService.acceptRequest(request.id, request.clientBankAccountId).subscribe({
      next: () => {
        this.paymentRequests = this.paymentRequests.filter(r => r.id !== request.id);
        this.clientService.getDashboardStats(this.clientId).subscribe({
          next: (stats) => this.stats = stats,
          error: (err) => console.error('Error updating stats:', err)
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to accept payment request';
      },
    });
  }
}
