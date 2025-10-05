import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-shared-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: { username?: string; email?: string } | null = null;
  notifications = [
    { id: 1, title: 'Payment Received', message: '₹12,000 credited from ABC Corp' },
    { id: 2, title: 'Invoice Approved', message: 'Your invoice #1243 has been approved' },
    { id: 3, title: 'System Update', message: 'New payroll report is now available' },
  ];

  constructor(private router: Router, private cookie: CookieService) {
    try {
      const u = this.cookie.get('user');
      this.user = u ? JSON.parse(u) : null;
    } catch {
      this.user = null;
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.cookie.delete('token', '/');
    this.cookie.delete('user', '/');
    this.router.navigate(['/login']);
  }

  markAsRead(notification: any) {
    this.notifications = this.notifications.filter((n) => n.id !== notification.id);
  }
}
