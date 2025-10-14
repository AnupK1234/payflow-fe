import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface SalaryAccountRequest {
  id: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  additionalInfo: string;
  status: string;
  requestedAt: string;
  processedAt?: string;
  approvedBy?: number;
  employeeId?: number;
  employeeName?: string;
  orgId?: number;
  orgName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalaryAccountRequestService {
  private baseUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<SalaryAccountRequest[]> {
    return this.http.get<SalaryAccountRequest[]>(`${this.baseUrl}/salary-account-requests`);
  }

  processRequest(requestId: number, approve: boolean): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/salary-account/requests/${requestId}/process?approve=${approve}`,
      {}
    );
  }
}
