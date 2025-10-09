import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSelfService } from '../../services/employee-self';
import { EmployeeSalaryStructureResponseDTO } from '../../models/employee-salary-structure.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css'],
  standalone: true,
  imports: [
    CommonModule,  // for *ngIf, *ngFor
    NavbarComponent // to use <app-navbar>
  ]
})
export class EmployeeDashboardComponent implements OnInit {

  salaryHistory: EmployeeSalaryStructureResponseDTO[] = [];
  loading = false;
  user = { username: 'Employee Name' }; // TODO: populate from auth

  constructor(private service: EmployeeSelfService) {}

  ngOnInit(): void {
    this.loadSalaryHistory();
  }

  loadSalaryHistory(): void {
    this.loading = true;
    this.service.getSalaryHistory().subscribe({
      next: (data) => {
        this.salaryHistory = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  downloadPdf(): void {
    this.service.downloadSalaryHistoryPdf();
  }

  downloadCsv(): void {
    this.service.downloadSalaryHistoryCsv();
  }
}
