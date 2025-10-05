import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../models/organization.model';
import { environment } from '../../../../environments/environment';

interface VerifyOrgPayload {
  organizationId: number;
  approve: boolean;
}

@Injectable({ providedIn: 'root' })
export class BankAdminService {
  private base = `${environment.apiUrl}/bank-admin`;

  constructor(private http: HttpClient) {}

  listPendingOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.base}/organizations/pending`);
  }

  listAllOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.base}/organizations`);
  }

  getOrganization(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.base}/organizations/${id}`);
  }

  verifyOrganization(payload: VerifyOrgPayload): Observable<Organization> {
    return this.http.post<Organization>(`${this.base}/organizations/verify`, payload);
  }
}
