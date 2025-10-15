


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ClientPaymentRequest, PaymentStatus } from '../models/client-payment-request'; 

@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService {
  private baseUrl = `${environment.apiUrl}/payment-requests`;
  private validStatuses: PaymentStatus[] = ['PENDING', 'ACCEPTED', 'PAID', 'FAILED', 'REJECTED'];

  constructor(private http: HttpClient) {}

  getPaymentHistory(
    startDate?: string,
    endDate?: string,
    status?: PaymentStatus
  ): Observable<ClientPaymentRequest[]> {
    let params = new HttpParams();

    if (startDate) params = params.set('startDate', new Date(startDate).toISOString());
    if (endDate) params = params.set('endDate', new Date(endDate).toISOString());
    if (status && this.validStatuses.includes(status)) params = params.set('status', status);

    return this.http.get<any[]>(`${this.baseUrl}/history`, { params }).pipe(
      map(data =>
        data.map(req => ({
          id: req.id,
          amount: req.amount,
          status: req.status,
          createdAt: req.createdAt || new Date().toISOString(),
          acceptedAt: req.acceptedAt || undefined,
          reason: req.reason || '',
          metadata: req.metadata || '',
          clientBankAccountId: req.clientBankAccountId || undefined
        } as ClientPaymentRequest))
      ),
      catchError(err => this.handleError(err, 'Failed to fetch payment history'))
    );
  }

  getRecentRequests(): Observable<ClientPaymentRequest[]> {
    return this.getPaymentHistory().pipe(
      catchError(err => this.handleError(err, 'Failed to fetch recent requests'))
    );
  }

  private handleError(err: any, defaultMessage: string): Observable<never> {
    console.error(defaultMessage, err);
    const message = err?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}
