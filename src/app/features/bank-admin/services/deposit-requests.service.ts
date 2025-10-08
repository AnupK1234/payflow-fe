import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DepositFilters, DepositRequest, PageResponse } from '../models/deposit.model';

@Injectable({
  providedIn: 'root',
})
export class DepositRequestsService {
  private apiUrl = `${environment.apiUrl}/deposits`;

  constructor(private http: HttpClient) {}

  // Get paginated list of deposit requests with filters
  getDepositRequests(filters: DepositFilters): Observable<PageResponse<DepositRequest>> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('size', filters.size.toString());

    // Add optional filters
    if (filters.status && filters.status !== 'ALL') {
      params = params.set('status', filters.status);
    }

    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    // Add sorting if provided (e.g., 'createdAt,desc')
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return this.http.get<PageResponse<DepositRequest>>(`${this.apiUrl}/bank`, { params });
  }

  // Approve or reject a deposit request
  approveDeposit(depositId: number, approve: boolean): Observable<DepositRequest> {
    const params = new HttpParams().set('approve', approve.toString());

    return this.http.post<DepositRequest>(
      `${this.apiUrl}/${depositId}/approve`,
      {},
      {
        params,
      }
    );
  }
}
