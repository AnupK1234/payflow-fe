import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeSalaryStructureResponseDTO } from '../models/employee-salary-structure.model';
import { SalaryAccountUpdateRequestDTO } from '../models/salary-account-update-request.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSelfService {

  //private baseUrl = '/api/employee/self';
  private baseUrl = 'http://localhost:8080/api/employee/self';

  constructor(private http: HttpClient) { }

  getSalaryHistory(): Observable<EmployeeSalaryStructureResponseDTO[]> {
    return this.http.get<EmployeeSalaryStructureResponseDTO[]>(`${this.baseUrl}/salary-history`);
  }

  downloadSalaryHistoryPdf(startDate?: string, endDate?: string): void {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    this.http.get(`${this.baseUrl}/salary-history/pdf`, { params, responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salary-history.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  downloadSalaryHistoryCsv(startDate?: string, endDate?: string): void {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    this.http.get(`${this.baseUrl}/salary-history/csv`, { params, responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salary-history.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  requestSalaryAccountUpdate(payload: SalaryAccountUpdateRequestDTO): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/salary-account/update-request`, payload);
  }
}
