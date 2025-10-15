import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css'],
  standalone: true,
  imports: [
    CommonModule,  
    NavbarComponent 
  ]
})
export class EmployeeDashboardComponent implements OnInit {

  username: string = 'Employee';
  currentDate: Date = new Date();
  allHolidays: any[] = [
    { name: 'New Year', date: new Date('2025-01-01') },
    { name: 'Republic Day', date: new Date('2025-01-26') },
    { name: 'Holi', date: new Date('2025-03-25') },
    { name: 'Independence Day', date: new Date('2025-08-15') },
    { name: 'Diwali', date: new Date('2025-10-23') },
    { name: 'Christmas', date: new Date('2025-12-25') }
  ];
  
  upcomingHolidays: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getUsernameFromStorage();
    this.filterUpcomingHolidays();
  }

  getUsernameFromStorage(): void {
    try {
      const userData = localStorage.getItem('username') || 
                      localStorage.getItem('user') ||
                      sessionStorage.getItem('username') ||
                      sessionStorage.getItem('user');

      if (userData) {
        if (userData.startsWith('{')) {
          const userObj = JSON.parse(userData);
          this.username = userObj.username || userObj.userName || 'Employee';
        } else {
          this.username = userData;
        }
      }

      if (this.username === 'Employee') {
        this.getUsernameFromCookies();
      }

    } catch (error) {
      console.error('Error reading username:', error);
    }
  }

  getUsernameFromCookies(): void {
    try {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'username' || name === 'user') {
          const cookieValue = decodeURIComponent(value);
          if (cookieValue.startsWith('{')) {
            const userObj = JSON.parse(cookieValue);
            this.username = userObj.username || 'Employee';
          } else {
            this.username = cookieValue;
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error reading cookies:', error);
    }
  }

  filterUpcomingHolidays(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.upcomingHolidays = this.allHolidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      holidayDate.setHours(0, 0, 0, 0);
      return holidayDate >= today;
    });
  }

  getDaysUntil(holidayDate: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const holiday = new Date(holidayDate);
    holiday.setHours(0, 0, 0, 0);
    
    const diffTime = holiday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}