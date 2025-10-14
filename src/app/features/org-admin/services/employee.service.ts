import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Concern } from '../models/concern.interface';
import { CookieService } from 'ngx-cookie-service';

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  status: 'ACTIVE' | 'INACTIVE';
  salary?: {
    basic: number;
    hra: number;
    da: number;
    pf: number;
    allowances: number;
    total: number;
  };
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  employeeCode: string;
  aadhaarNumber: number;
  panNumber: string;
  organizationId: string;
  jobTitle: string;
  dateOfJoining: string;
  bankAccount: {
    accountNumber: string;
    ifsc: string;
  };
  salary: {
    basic: number;
    hra: number;
    da: number;
    pf: number;
    allowances: number;
  };
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  designation?: string;
  status?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface EmployeeFilters {
  department?: string;
  status?: string;
  search?: string;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${environment.apiUrl}/employees`;
  private cookie = inject(CookieService);

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of employees with filters
   */
  getEmployees(filters: EmployeeFilters): Observable<PageResponse<Employee>> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('size', filters.size.toString());

    if (filters.department && filters.department !== 'ALL') {
      params = params.set('department', filters.department);
    }

    if (filters.status && filters.status !== 'ALL') {
      params = params.set('status', filters.status);
    }

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<PageResponse<Employee>>(this.apiUrl, { params });
  }

  /**
   * Get employee by ID
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new employee
   */
  createEmployee(employee: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  /**
   * Update employee
   */
  updateEmployee(id: number, employee: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update employee salary
   */
  updateEmployeeSalary(id: number, salary: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}/salary`, salary);
  }

  // get employee concern by org id
  getConcernList(): Observable<Concern[]> {
    const organizationId = JSON.parse(this.cookie.get('user'))?.organizationId;
    return this.http.get<Concern[]>(`${this.baseUrl}/concerns/organization/${organizationId}`);
  }

  updateConcernStatus(id: number, body: { status: string }) {
    return this.http.put(`${this.baseUrl}/concerns/${id}/status`, body);
  }

  getEmployeeSalaryStructures(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/salary-structures`);
  }

  addEmployeeSalaryStructure(id: number, body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/salary-structures`, body);
  }
}
