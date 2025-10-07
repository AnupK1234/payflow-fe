import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization, OrganizationStatus } from '../models/organization.model';
import { environment } from '../../../../environments/environment';

interface VerifyOrgPayload {
  organizationId: number;
  approve: boolean;
}

@Injectable({ providedIn: 'root' })
export class BankAdminService {
  private baseUrl = `${environment.apiUrl}/bank-admin`;

  constructor(private http: HttpClient) {}

  listPendingOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.baseUrl}/organizations/pending`);
  }

  listAllOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.baseUrl}/organizations`);
  }

  getOrganization(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.baseUrl}/organizations/${id}`);
  }

  verifyOrganization(payload: VerifyOrgPayload): Observable<Organization> {
    return this.http.post<Organization>(`${this.baseUrl}/organizations/verify`, payload);
  }

  // Unified status update (Suspend / Unsuspend)
  updateOrganizationStatus(organizationId: number, newStatus: OrganizationStatus): Observable<Organization> {
        const body = { status: newStatus }; // Matches StatusUpdateRequest structure
        // Endpoint: /api/bank-admin/organizations/{id}/status
        return this.http.put<Organization>(`${this.baseUrl}/organizations/${organizationId}/status`, body);
    }
}
