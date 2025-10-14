import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BatchUploadResponse {
  message: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeBatchService {
  private apiUrl = `${environment.apiUrl}/employees/batch`;

  constructor(private http: HttpClient) {}

  /**
   * Upload CSV file for batch employee import
   * @param file CSV file containing employee data
   * @param organizationId Organization ID to associate employees with
   * @returns Observable with upload response
   */
  uploadEmployeeBatch(file: File): Observable<BatchUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<BatchUploadResponse>(
      `${this.apiUrl}/import`,
      formData
    );
  }

}