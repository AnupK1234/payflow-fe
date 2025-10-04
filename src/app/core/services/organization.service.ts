// src/app/core/services/organization.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrganizationRequest } from '../../interfaces/organization-request.interface'; // Adjust path
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Sends the registration request to the backend.
   * @param formData The FormData object containing JSON data and files.
   * @returns An observable of the API response.
   */
  register(formData: FormData): Observable<any> {
    // Note: HttpClient automatically sets the Content-Type header correctly for FormData.
    return this.http
      .post(this.apiUrl + '/organizations/register', formData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || 'Registration failed. Please try again.';
    }
    console.error('Organization Service Error:', error);
    // Throw an Error object with a clean message for the component to display
    return throwError(() => new Error(errorMessage));
  }
}
