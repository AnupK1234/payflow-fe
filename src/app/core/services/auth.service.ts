import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/login-response.interface';
import { LoginRequest } from '../../interfaces/login-request.interface';
import { User } from '../../interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  // Login method
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.storeAuthData(response)),
      map(response => response.user),
      catchError(this.handleError)
    );
  }

  // Store token and user info in cookies
  private storeAuthData(response: LoginResponse): void {
    const expiryTime = 1 / 24; // 1 hour in days

    this.cookieService.set('token', response.token, expiryTime, '/');
    this.cookieService.set('user', JSON.stringify(response.user), expiryTime, '/');
  }

  // Handle errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || 'Invalid username or password';
    }
    console.error(error);
    return throwError(() => new Error(errorMessage));
  }

  // Route user based on role
  routeUserByRole(user: User): void {
    if (user.mustResetPassword) {
      this.router.navigate(['/reset-password'], { queryParams: { firstLogin: true } });
      return;
    }

    const role = user.role?.toUpperCase(); // normalize case
    switch (role) {
      case 'BANK_ADMIN':
        this.router.navigate(['/bank-admin/dashboard']);
        break;
      case 'ORG_ADMIN':
        this.router.navigate(['/organization/dashboard']);
        break;
      case 'EMPLOYEE':
        this.router.navigate(['/employee/dashboard']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        console.error('Unknown user role:', role);
    }
  }

  // Logout method
  logout(): void {
    this.cookieService.delete('token', '/');
    this.cookieService.delete('user', '/');
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.cookieService.check('token');
  }

  // Get current logged-in user
  getCurrentUser(): User | null {
    const user = this.cookieService.get('user');
    return user ? JSON.parse(user) : null;
  }
  requestPasswordResetOtp(email: string): Observable<string> {
    const data: OtpRequest = { email };
    return this.http.post<string>(`${this.apiUrl}/forgot-password`, data, {
      responseType: 'text' as 'json',
    });
  }

  verifyOtp(email: string, otp: string): Observable<string> {
    const data: OtpVerificationRequest = { email, otp };
    return this.http.post<string>(`${this.apiUrl}/verify-otp`, data, {
      responseType: 'text' as 'json',
    });
  }

  resetPassword(data: PasswordResetRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/reset-password`, data, {
      responseType: 'text' as 'json',
    });
  }

  formatError(error: any): string {
    try {
      const errorBody = JSON.parse(error.error);
      return errorBody?.message || 'An unknown error occurred.';
    } catch (e) {
      return error.error || 'Failed to communicate with the server.';
    }
  }
}
