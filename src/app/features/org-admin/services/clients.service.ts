import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Client {
  id: number;
  companyName: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: string;
  organizationName?: string;
}

export interface ClientRequest {
  companyName: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: string;
  isDeleted?: boolean;
  organizationId: number;
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  /**
   * Get all clients for the organization
   */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  /**
   * Get client by ID
   */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new client
   */
  createClient(client: ClientRequest): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  /**
   * Update client
   */
  updateClient(id: number, client: ClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  /**
   * Delete client
   */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
