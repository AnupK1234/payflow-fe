import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientPaymentRequest } from '../models/client-payment-request.model';
import { BankAccount } from '../models/bank-account.model';
import { environment } from '../../../../environments/environment';

export type PaymentStatus = 'PENDING' | 'ACCEPTED' | 'PAID' | 'FAILED' | 'REJECTED';

export interface DashboardStats {
  totalRequests: number;
  pending: number;
  accepted: number;
  paid: number;
  failed: number;
  rejected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private paymentBaseUrl = `${environment.apiUrl}/payment-requests`;

  constructor(private http: HttpClient) {}

  /** Fetch all active bank accounts for a client */
  getClientBankAccounts(clientId: number): Observable<BankAccount[]> {
    return this.http
      .get<BankAccount[]>(`${this.paymentBaseUrl}/client/${clientId}/bank-accounts`)
      .pipe(catchError(err => this.handleError(err, 'Failed to fetch bank accounts')));
  }

  /** Accept a payment request */
  acceptRequest(requestId: number, clientBankAccountId: number): Observable<ClientPaymentRequest> {
    return this.http
      .post<ClientPaymentRequest>(
        `${this.paymentBaseUrl}/${requestId}/accept/${clientBankAccountId}`,
        {}
      )
      .pipe(catchError(err => this.handleError(err, 'Failed to accept payment request')));
  }

  /** Fetch payment history for a client */
  getPaymentHistory(
    clientId: number,
    startDate?: string,
    endDate?: string,
    status?: PaymentStatus
  ): Observable<ClientPaymentRequest[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (status) params = params.set('status', status);

    return this.http
      .get<ClientPaymentRequest[]>(`${this.paymentBaseUrl}/client/${clientId}/history`, { params })
      .pipe(catchError(err => this.handleError(err, 'Failed to fetch payment history')));
  }

  /** Get recent 5 payment requests */
  getRecentRequests(clientId: number): Observable<ClientPaymentRequest[]> {
    return this.getPaymentHistory(clientId).pipe(
      map(requests => requests.slice(0, 5)),
      catchError(err => this.handleError(err, 'Failed to fetch recent requests'))
    );
  }

  /** Compute dashboard stats from payment history */
  getDashboardStats(clientId: number): Observable<DashboardStats> {
    return this.getPaymentHistory(clientId).pipe(
      map((requests: ClientPaymentRequest[]) => ({
        totalRequests: requests.length,
        pending: requests.filter(r => r.status === 'PENDING').length,
        accepted: requests.filter(r => r.status === 'ACCEPTED').length,
        paid: requests.filter(r => r.status === 'PAID').length,
        failed: requests.filter(r => r.status === 'FAILED').length,
        rejected: requests.filter(r => r.status === 'REJECTED').length
      })),
      catchError(err => this.handleError(err, 'Failed to compute dashboard stats'))
    );
  }

  /** Error handler */
  private handleError(err: any, defaultMessage: string): Observable<never> {
    console.error(defaultMessage, err);
    const message = err?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}
