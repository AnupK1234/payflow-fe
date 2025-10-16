// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { EmployeeSelfService } from '../../services/employee-self';
// import { EmployeeSalaryStructureResponseDTO } from '../../models/employee-salary-structure.model';

// @Component({
//   selector: 'app-employee-salary-history',
//   templateUrl: './employee-salary-history.html',
//   styleUrls: ['./employee-salary-history.css'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class EmployeeSalaryHistoryComponent implements OnInit {

//   salaryHistory: EmployeeSalaryStructureResponseDTO[] = [];
//   loading = false;

//   constructor(private service: EmployeeSelfService) {}

//   ngOnInit(): void {
//     this.loadSalaryHistory();
//   }

//   loadSalaryHistory(): void {
//     this.loading = true;
//     this.service.getSalaryHistory().subscribe({
//       next: (data) => {
//         this.salaryHistory = data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   downloadPdf(): void {
//     this.service.downloadSalaryHistoryPdf();
//   }

//   downloadCsv(): void {
//     this.service.downloadSalaryHistoryCsv();
//   }
// }







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
        console.log('Salary data with dates:', data);
        if (data && data.length > 0) {
          console.log('First record effective_from:', data[0].effective_from);
          console.log('First record effective_to:', data[0].effective_to);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Safe date formatting for effective_from and effective_to
  formatDate(dateString: any): string {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  }

  downloadPdf(): void {
    this.service.downloadSalaryHistoryPdf();
  }

  downloadCsv(): void {
    this.service.downloadSalaryHistoryCsv();
  }
}