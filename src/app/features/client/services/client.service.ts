// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map } from 'rxjs/operators'; // <-- add this
// import { Observable, catchError, throwError } from 'rxjs';
// import { ClientPaymentRequest } from '../models/client-payment-request.model';
// export interface DashboardStats {
//   totalRequests: number;
//   pending: number;
//   accepted: number;
//   rejected: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ClientService {
//   private baseUrl = '/api/payment-requests';

//   constructor(private http: HttpClient) {}

//   // Fetch payment history
//   getPaymentHistory(clientId: number): Observable<ClientPaymentRequest[]> {
//     return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/history`);
//   }

//   // Get dashboard stats
//   getDashboardStats(clientId: number): Observable<DashboardStats> {
//     return this.getPaymentHistory(clientId).pipe(
//       map((requests: ClientPaymentRequest[]) => {
//         const totalRequests = requests.length;
//         const pending = requests.filter(r => r.status === 'PENDING').length;
//         const accepted = requests.filter(r => r.status === 'ACCEPTED').length;
//         const rejected = requests.filter(r => r.status === 'REJECTED').length;
//         return { totalRequests, pending, accepted, rejected };
//       })
//     );
//   }
// // }
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { ClientPaymentRequest } from '../models/client-payment-request.model';

// export interface DashboardStats {
//   totalRequests: number;
//   pending: number;
//   accepted: number;
//   rejected: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ClientService {
//   private baseUrl = 'http://localhost:8080/api/payment-requests';

//   constructor(private http: HttpClient) {}

//   // Fetch pending requests for a client
//   getPendingRequests(clientId: number): Observable<ClientPaymentRequest[]> {
//     return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/pending`).pipe(
//       catchError(err => {
//         console.error('Error fetching pending requests:', err);
//         return throwError(() => new Error('Failed to fetch pending requests'));
//       })
//     );
//   }

//   // Accept a payment request (send clientBankAccountId in request body)
//   acceptRequest(requestId: number, clientBankAccountId: number): Observable<ClientPaymentRequest> {
//     return this.http.post<ClientPaymentRequest>(
//       `${this.baseUrl}/${requestId}/accept`,
//       { clientBankAccountId }
//     ).pipe(
//       catchError(err => {
//         console.error('Error accepting request:', err);
//         // Extract backend error message if available
//         const msg = err?.error?.message || 'Failed to accept request';
//         return throwError(() => new Error(msg));
//       })
//     );
//   }

//   // Fetch recent requests
//   getRecentRequests(clientId: number): Observable<ClientPaymentRequest[]> {
//     return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/recent`).pipe(
//       catchError(err => {
//         console.error('Error fetching recent requests:', err);
//         return throwError(() => new Error('Failed to fetch recent requests'));
//       })
//     );
//   }

//   // Fetch payment history with optional filters
//   getPaymentHistory(clientId: number, startDate?: string, endDate?: string, status?: string): Observable<ClientPaymentRequest[]> {
//     let params = new HttpParams();
//     if (startDate) params = params.set('startDate', startDate);
//     if (endDate) params = params.set('endDate', endDate);
//     if (status) params = params.set('status', status);

//     return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/history`, { params }).pipe(
//       catchError(err => {
//         console.error('Error fetching payment history:', err);
//         return throwError(() => new Error('Failed to fetch payment history'));
//       })
//     );
//   }

//   // Compute dashboard stats from payment history
//   getDashboardStats(clientId: number): Observable<DashboardStats> {
//     return this.getPaymentHistory(clientId).pipe(
//       map((requests: ClientPaymentRequest[]) => {
//         const totalRequests = requests.length;
//         const pending = requests.filter(r => r.status === 'PENDING').length;
//         const accepted = requests.filter(r => r.status === 'ACCEPTED').length;
//         const rejected = requests.filter(r => r.status === 'REJECTED').length;
//         return { totalRequests, pending, accepted, rejected };
//       }),
//       catchError(err => {
//         console.error('Error computing dashboard stats:', err);
//         return throwError(() => new Error('Failed to compute dashboard stats'));
//       })
//     );
//   }
// }




// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { ClientPaymentRequest } from '../models/client-payment-request.model';

// export interface DashboardStats {
//   totalRequests: number;
//   pending: number;
//   accepted: number;
//   rejected: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ClientService {
//   // Backend API base URL
//   private baseUrl = 'http://localhost:8080/api/payment-requests';

//   constructor(private http: HttpClient) {}

//   /**
//    * Fetch all pending payment requests for a client
//    */
//   getPendingRequests(clientId: number): Observable<ClientPaymentRequest[]> {
//     return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/pending`).pipe(
//       catchError(err => this.handleError(err, 'Failed to fetch pending requests'))
//     );
//   }

//   /**
//    * Accept a payment request (send requestId and bankAccountId as path variables)
//    */
//   acceptRequest(requestId: number, clientBankAccountId: number): Observable<ClientPaymentRequest> {
//     return this.http.post<ClientPaymentRequest>(
//       `${this.baseUrl}/${requestId}/accept/${clientBankAccountId}`, // bank account ID in URL
//       {} // empty POST body
//     ).pipe(
//       catchError(err => this.handleError(err, 'Failed to accept payment request'))
//     );
//   }

//   /**
//    * Fetch recent payment requests for a client
//    */
//   getRecentRequests(clientId: number): Observable<ClientPaymentRequest[]> {
//     return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/recent`).pipe(
//       catchError(err => this.handleError(err, 'Failed to fetch recent requests'))
//     );
//   }

//   /**
//    * Fetch payment history for a client with optional filters
//    */
//   getPaymentHistory(clientId: number, startDate?: string, endDate?: string, status?: string): Observable<ClientPaymentRequest[]> {
//     let params = new HttpParams();
//     if (startDate) params = params.set('startDate', startDate);
//     if (endDate) params = params.set('endDate', endDate);
//     if (status) params = params.set('status', status);

//     return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/history`, { params }).pipe(
//       catchError(err => this.handleError(err, 'Failed to fetch payment history'))
//     );
//   }

//   /**
//    * Compute dashboard statistics from payment history
//    */
//   getDashboardStats(clientId: number): Observable<DashboardStats> {
//     return this.getPaymentHistory(clientId).pipe(
//       map((requests: ClientPaymentRequest[]) => ({
//         totalRequests: requests.length,
//         pending: requests.filter(r => r.status === 'PENDING').length,
//         accepted: requests.filter(r => r.status === 'ACCEPTED').length,
//         rejected: requests.filter(r => r.status === 'REJECTED').length
//       })),
//       catchError(err => this.handleError(err, 'Failed to compute dashboard stats'))
//     );
//   }

//   /**
//    * Centralized error handler
//    */
//   private handleError(err: any, defaultMessage: string): Observable<never> {
//     console.error(defaultMessage, err);
//     const message = err?.error?.message || defaultMessage;
//     return throwError(() => new Error(message));
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientPaymentRequest } from '../models/client-payment-request.model';
import { BankAccount } from '../models/bank-account.model';

export interface DashboardStats {
  totalRequests: number;
  pending: number;
  accepted: number;
  rejected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8080/api/payment-requests';

  constructor(private http: HttpClient) {}

  getPendingRequests(clientId: number): Observable<ClientPaymentRequest[]> {
    return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/pending`).pipe(
      catchError(err => this.handleError(err, 'Failed to fetch pending requests'))
    );
  }

  getClientBankAccounts(clientId: number): Observable<BankAccount[]> {
  return this.http.get<BankAccount[]>(`http://localhost:8080/api/clients/${clientId}/bank-accounts`).pipe(
    catchError(err => this.handleError(err, 'Failed to fetch bank accounts'))
  );
}

  /**
   * Accept a payment request by passing both requestId and clientBankAccountId
   */
  acceptRequest(requestId: number, clientBankAccountId: number): Observable<ClientPaymentRequest> {
    return this.http.post<ClientPaymentRequest>(
      `${this.baseUrl}/${requestId}/accept/${clientBankAccountId}`, {}
    ).pipe(
      catchError(err => this.handleError(err, 'Failed to accept payment request'))
    );
  }

  getRecentRequests(clientId: number): Observable<ClientPaymentRequest[]> {
    return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/recent`).pipe(
      catchError(err => this.handleError(err, 'Failed to fetch recent requests'))
    );
  }

  getPaymentHistory(clientId: number, startDate?: string, endDate?: string, status?: string): Observable<ClientPaymentRequest[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (status) params = params.set('status', status);

    return this.http.get<ClientPaymentRequest[]>(`${this.baseUrl}/client/${clientId}/history`, { params }).pipe(
      catchError(err => this.handleError(err, 'Failed to fetch payment history'))
    );
  }

  


  getDashboardStats(clientId: number): Observable<DashboardStats> {
    return this.getPaymentHistory(clientId).pipe(
      map((requests: ClientPaymentRequest[]) => ({
        totalRequests: requests.length,
        pending: requests.filter(r => r.status === 'PENDING').length,
        accepted: requests.filter(r => r.status === 'ACCEPTED').length,
        rejected: requests.filter(r => r.status === 'REJECTED').length
      })),
      catchError(err => this.handleError(err, 'Failed to compute dashboard stats'))
    );
  }

  private handleError(err: any, defaultMessage: string): Observable<never> {
    console.error(defaultMessage, err);
    const message = err?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}
