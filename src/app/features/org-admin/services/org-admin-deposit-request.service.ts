import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateDepositRequest, DepositResponse } from '../models/deposit-request.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrgAdminDepositRequestService {
  private depositBaseUrl = `${environment.apiUrl}/deposits`;

  constructor(private http: HttpClient) {}

  
   
  createDepositRequest(deposit: CreateDepositRequest): Observable<DepositResponse> {
    return this.http.post<DepositResponse>(`${this.depositBaseUrl}`, deposit)
      .pipe(catchError(err => this.handleError(err, 'Failed to create deposit request')));
  }

  
  listDeposits(): Observable<DepositResponse[]> {
    return this.http.get<DepositResponse[]>(`${this.depositBaseUrl}/org`)
      .pipe(catchError(err => this.handleError(err, 'Failed to fetch deposit requests')));
  }

  private handleError(err: any, defaultMessage: string): Observable<never> {
    console.error(defaultMessage, err);
    const message = err?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}
