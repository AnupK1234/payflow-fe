import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ClientPaymentRequestDTO {
  clientId: number;
  amount: number;
  reason: string;
  dueDate: string;
  invoiceNumber?: string;
  taxAmount?: number;
  notes?: string;
}

export interface ClientPaymentRequest {
  id: number;
  clientId: number;
  amount: number;
  description: string;
  dueDate: string;
  invoiceNumber?: string;
  taxAmount?: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentRequestService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Send payment request to a client
   */
  sendPaymentRequest(request: ClientPaymentRequestDTO): Observable<ClientPaymentRequest> {
    return this.http.post<ClientPaymentRequest>(`${this.apiUrl}/payment-requests/send`, request);
  }

  /**
   * Get all payment requests for the organization
   */
  getAllPaymentRequests(): Observable<ClientPaymentRequest[]> {
    return this.http.get<ClientPaymentRequest[]>(this.apiUrl);
  }

  /**
   * Get payment request by ID
   */
  getPaymentRequestById(id: number): Observable<ClientPaymentRequest> {
    return this.http.get<ClientPaymentRequest>(`${this.apiUrl}/clients/${id}`);
  }
}
