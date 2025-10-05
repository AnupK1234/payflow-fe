import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private cookie: CookieService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'] as string | undefined;
    try {
      const userStr = this.cookie.get('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user || user.role !== expectedRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
