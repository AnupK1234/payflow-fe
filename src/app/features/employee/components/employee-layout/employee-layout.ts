import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-layout',
  templateUrl: './employee-layout.html',
  styleUrls: ['./employee-layout.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule]
})
export class EmployeeLayoutComponent {
  sidebarCollapsed = false;

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
