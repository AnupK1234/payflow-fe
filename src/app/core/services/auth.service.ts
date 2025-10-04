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
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<LoginResponse>(this.apiUrl + '/auth/login', credentials).pipe(
      tap((response) => this.storeAuthData(response)),
      map((response) => response.user),
      catchError(this.handleError)
    );
  }

  private storeAuthData(response: LoginResponse): void {
    const expiryTime = 1 / 24; // 1 hour in days

    this.cookieService.set('token', response.token, expiryTime, '/');
    this.cookieService.set('user', JSON.stringify(response.user), expiryTime, '/');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = error.error?.message || 'Invalid username or password';
    }
    console.error(error);
    return throwError(() => new Error(errorMessage));
  }

  routeUserByRole(user: any): string {
    if (user.mustResetPassword) {
      this.router.navigate(['/reset-password'], {
        queryParams: { firstLogin: true },
      });
      return 'reset-password';
    }

    switch (user.role) {
      case 'BANK_ADMIN':
        this.router.navigate(['/bank-admin/dashboard']);
        return '/bank-admin/dashboard';
      case 'ORG_ADMIN':
        this.router.navigate(['/organization/dashboard']);
        return '/organization/dashboard';
      case 'EMPLOYEE':
        this.router.navigate(['/employee/dashboard']);
        return '/employee/dashboard';
      default:
        // Handle unknown role gracefully, maybe log out and redirect to home
        return 'Unknown user role';
    }
  }

  // Add methods for logout, checking authentication status, etc. here in the future
}
