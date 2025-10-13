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

  getClientBankAccounts(clientId: number): Observable<BankAccount[]> {
    return this.http
      .get<BankAccount[]>(`${this.paymentBaseUrl}/client/${clientId}/bank-accounts`)
      .pipe(catchError(err => this.handleError(err, 'Failed to fetch bank accounts')));
  }

  acceptRequest(requestId: number, clientBankAccountId: number): Observable<ClientPaymentRequest> {
    return this.http
      .post<ClientPaymentRequest>(`${this.paymentBaseUrl}/${requestId}/accept/${clientBankAccountId}`, {})
      .pipe(catchError(err => this.handleError(err, 'Failed to accept payment request')));
  }

  /** NEW: Reject request */
  rejectRequest(requestId: number): Observable<ClientPaymentRequest> {
    return this.http
      .post<ClientPaymentRequest>(`${this.paymentBaseUrl}/${requestId}/reject`, {})
      .pipe(catchError(err => this.handleError(err, 'Failed to reject payment request')));
  }

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

  getRecentRequests(clientId: number): Observable<ClientPaymentRequest[]> {
    return this.getPaymentHistory(clientId).pipe(
      map(requests => requests.slice(0, 5)),
      catchError(err => this.handleError(err, 'Failed to fetch recent requests'))
    );
  }

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

  private handleError(err: any, defaultMessage: string): Observable<never> {
    console.error(defaultMessage, err);
    const message = err?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}
