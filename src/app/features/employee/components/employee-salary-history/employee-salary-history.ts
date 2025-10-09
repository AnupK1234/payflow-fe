import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSelfService } from '../../services/employee-self';
import { EmployeeSalaryStructureResponseDTO } from '../../models/employee-salary-structure.model';

@Component({
  selector: 'app-employee-salary-history',
  templateUrl: './employee-salary-history.html',
  styleUrls: ['./employee-salary-history.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EmployeeSalaryHistoryComponent implements OnInit {

  salaryHistory: EmployeeSalaryStructureResponseDTO[] = [];
  loading = false;

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
