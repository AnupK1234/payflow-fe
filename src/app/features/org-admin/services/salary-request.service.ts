import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SalaryDisbursementRequest,
  SalaryRequestFilters,
} from '../models/salary-filters.interface';
import { PageResponse } from './employee.service';

@Injectable({
  providedIn: 'root',
})
export class OrgSalaryRequestsService {
  private apiUrl = `${environment.apiUrl}/salary-disbursement`;

  constructor(private http: HttpClient) {}

  getOrganizationRequests(
    filters: SalaryRequestFilters
  ): Observable<PageResponse<SalaryDisbursementRequest>> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('size', filters.size.toString());

    if (filters.status && filters.status !== 'ALL') {
      params = params.set('status', filters.status);
    }

    return this.http.get<PageResponse<SalaryDisbursementRequest>>(
      `${this.apiUrl}/organization/requests`,
      { params }
    );
  }

  createRequest(): Observable<SalaryDisbursementRequest> {
    return this.http.post<SalaryDisbursementRequest>(`${this.apiUrl}/request`, {});
  }
}
