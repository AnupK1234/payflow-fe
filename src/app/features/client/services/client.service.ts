

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientPaymentRequest } from '../models/client-payment-request.model';
import { BankAccount } from '../models/bank-account.model';
import { CreateDepositRequest } from '../models/deposit-request.model';
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
  private depositBaseUrl = `${environment.apiUrl}/deposits`;
  private validStatuses: PaymentStatus[] = ['PENDING', 'ACCEPTED', 'PAID', 'FAILED', 'REJECTED'];

  constructor(private http: HttpClient) {}

  // ------------------ Bank Accounts ------------------
  getClientBankAccounts(): Observable<BankAccount[]> {
    return this.http
      .get<BankAccount[]>(`${this.paymentBaseUrl}/client/bank-accounts`)
      .pipe(catchError(err => this.handleError(err, 'Failed to fetch bank accounts')));
  }

  // ------------------ Payment Requests ------------------
  acceptRequest(requestId: number, clientBankAccountId: number): Observable<ClientPaymentRequest> {
    return this.http
      .post<ClientPaymentRequest>(`${this.paymentBaseUrl}/${requestId}/accept/${clientBankAccountId}`, {})
      .pipe(catchError(err => this.handleError(err, 'Failed to accept payment request')));
  }

  rejectRequest(requestId: number): Observable<ClientPaymentRequest> {
    return this.http
      .post<ClientPaymentRequest>(`${this.paymentBaseUrl}/${requestId}/reject`, {})
      .pipe(catchError(err => this.handleError(err, 'Failed to reject payment request')));
  }

  // ------------------ Deposit Requests ------------------
  createDepositRequest(deposit: CreateDepositRequest): Observable<any> {
    return this.http
      .post<any>(`${this.depositBaseUrl}`, deposit)
      .pipe(catchError(err => this.handleError(err, 'Failed to create deposit request')));
  }

  // ------------------ Payment History ------------------
  getPaymentHistory(
    startDate?: string,
    endDate?: string,
    status?: PaymentStatus
  ): Observable<ClientPaymentRequest[]> {
    let params = new HttpParams();

    if (startDate) params = params.set('startDate', new Date(startDate).toISOString());
    if (endDate) params = params.set('endDate', new Date(endDate).toISOString());
    if (status && this.validStatuses.includes(status)) params = params.set('status', status);

    return this.http
      .get<ClientPaymentRequest[]>(`${this.paymentBaseUrl}/history`, { params })
      .pipe(catchError(err => this.handleError(err, 'Failed to fetch payment history')));
  }

  // ------------------ Helpers for Dashboard ------------------
  getRecentRequests(): Observable<ClientPaymentRequest[]> {
    return this.getPaymentHistory().pipe(
      map(requests => requests.slice(0, 5)),
      catchError(err => this.handleError(err, 'Failed to fetch recent requests'))
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.getPaymentHistory().pipe(
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

  // ------------------ Error Handling ------------------
  private handleError(err: any, defaultMessage: string): Observable<never> {
    console.error(defaultMessage, err);
    const message = err?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}
