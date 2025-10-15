

// import { Component, OnInit } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import { forkJoin, interval, switchMap, finalize } from "rxjs";
// import { OrgSalaryRequestsService } from '../../services/salary-request.service';
// import { SalaryDisbursementRequest } from "../../models/salary-filters.interface";
// import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
// import { NgChartsModule } from 'ng2-charts';
// import { ChartData, ChartOptions } from 'chart.js';

// @Component({
//   selector: 'app-org-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, NavbarComponent, NgChartsModule],
//   templateUrl: './org-admin-dashboard.component.html',
//   styleUrls: ['./org-admin-dashboard.component.css']
// })
// export class OrgAdminDashboardComponent implements OnInit {

//   stats = {
//     totalRequests: 0,
//     pendingRequests: 0,
//     approvedRequests: 0,
//     rejectedRequests: 0
//   };

//   statsArray: { label: string, value: string | number, icon: string, bg: string }[] = [];
//   recentRequests: SalaryDisbursementRequest[] = [];
//   lastUpdated: Date = new Date();
//   loading = false;

//   // Pie Chart
//   public pieChartLabels: string[] = ['Approved', 'Pending', 'Rejected'];
//   public pieChartData: ChartData<'pie', number[], any> = {
//     labels: this.pieChartLabels as any, // cast to any
//     datasets: [{ data: [0, 0, 0] } as any]
//   };
//   public pieChartOptions: ChartOptions = { responsive: true };

//   // Line Chart
//   public lineChartLabels: string[] = [];
//   public lineChartData: ChartData<'line', number[], any> = {
//     labels: [] as any,
//     datasets: [{ data: [], label: 'Requests per Day', fill: true, tension: 0.3 } as any]
//   };
//   public lineChartOptions: ChartOptions = { responsive: true };

//   constructor(private salaryService: OrgSalaryRequestsService) {}

//   ngOnInit(): void {
//     this.loadDashboardData();

//     interval(30000)
//       .pipe(switchMap(() => this.fetchData()))
//       .subscribe({
//         next: ({ requests }) => this.processData(requests.content),
//         error: err => console.error('Error updating org dashboard:', err)
//       });
//   }

//   loadDashboardData(): void {
//     this.fetchData().subscribe({
//       next: ({ requests }) => this.processData(requests.content),
//       error: err => console.error('Error loading org dashboard:', err)
//     });
//   }

//   fetchData() {
//     this.loading = true;
//     return forkJoin({
//       requests: this.salaryService.getOrganizationRequests({ page: 0, size: 100, status: 'ALL' })
//     }).pipe(finalize(() => this.loading = false));
//   }

//   processData(requests: SalaryDisbursementRequest[]) {
//     // Stats
//     this.stats.totalRequests = requests.length;
//     this.stats.pendingRequests = requests.filter(r => r.status === 'PENDING').length;
//     this.stats.approvedRequests = requests.filter(r => r.status === 'APPROVED').length;
//     this.stats.rejectedRequests = requests.filter(r => r.status === 'REJECTED').length;

//     this.statsArray = [
//       { label: 'Total Requests', value: this.stats.totalRequests, icon: 'bi-list-check', bg: 'bg-primary text-white' },
//       { label: 'Pending', value: this.stats.pendingRequests, icon: 'bi-hourglass-split', bg: 'bg-warning text-dark' },
//       { label: 'Approved', value: this.stats.approvedRequests, icon: 'bi-check-circle', bg: 'bg-success text-white' },
//       { label: 'Rejected', value: this.stats.rejectedRequests, icon: 'bi-x-circle', bg: 'bg-danger text-white' }
//     ];

//     // Pie Chart
//     this.pieChartData.datasets[0].data = [
//       this.stats.approvedRequests,
//       this.stats.pendingRequests,
//       this.stats.rejectedRequests
//     ];
//     this.pieChartData.labels = this.pieChartLabels.slice() as any;

//     // Line Chart
//     const grouped: { [date: string]: number } = {};
//     requests.forEach(r => {
//       const day = new Date(r.requestDate).toLocaleDateString();
//       grouped[day] = (grouped[day] || 0) + 1;
//     });

//     this.lineChartLabels = Object.keys(grouped);
//     this.lineChartData.labels = this.lineChartLabels.slice() as any;
//     this.lineChartData.datasets[0].data = Object.values(grouped) as any;

//     // Recent Requests
//     this.recentRequests = requests
//       .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
//       .slice(0, 5);

//     this.lastUpdated = new Date();
//   }

//   refreshDashboard(): void {
//     this.loadDashboardData();
//   }
// }



import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { forkJoin, interval, switchMap, finalize } from "rxjs";
import { OrgSalaryRequestsService } from '../../services/salary-request.service';
import { SalaryDisbursementRequest } from "../../models/salary-filters.interface";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-org-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgChartsModule],
  templateUrl: './org-admin-dashboard.component.html',
  styleUrls: ['./org-admin-dashboard.component.css']
})
export class OrgAdminDashboardComponent implements OnInit {

  stats = {
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  };

  statsArray: { label: string, value: string | number, icon: string, bg: string }[] = [];
  recentRequests: SalaryDisbursementRequest[] = [];
  lastUpdated: Date = new Date();
  loading = false;

  // Pie Chart
  public pieChartLabels: string[] = ['Approved', 'Pending', 'Rejected'];
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0, 0], label: 'Requests' }]
  };
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  // Line Chart
  public lineChartLabels: string[] = [];
  public lineChartData: ChartData<'line', number[], string> = {
    labels: this.lineChartLabels,
    datasets: [
      { data: [], label: 'Requests per Day', fill: true, tension: 0.3 }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = { responsive: true };

  constructor(private salaryService: OrgSalaryRequestsService) {}

  ngOnInit(): void {
    this.loadDashboardData();

    // Auto-refresh every 30 seconds
    interval(30000)
      .pipe(switchMap(() => this.fetchData()))
      .subscribe({
        next: ({ requests }) => this.processData(requests.content),
        error: err => console.error('Error updating org dashboard:', err)
      });
  }

  loadDashboardData(): void {
    this.fetchData().subscribe({
      next: ({ requests }) => this.processData(requests.content),
      error: err => console.error('Error loading org dashboard:', err)
    });
  }

  fetchData() {
    this.loading = true;
    return forkJoin({
      requests: this.salaryService.getOrganizationRequests({ page: 0, size: 100, status: 'ALL' })
    }).pipe(finalize(() => this.loading = false));
  }

  processData(requests: SalaryDisbursementRequest[]) {
    // Stats
    this.stats.totalRequests = requests.length;
    this.stats.pendingRequests = requests.filter(r => r.status === 'PENDING').length;
    this.stats.approvedRequests = requests.filter(r => r.status === 'APPROVED').length;
    this.stats.rejectedRequests = requests.filter(r => r.status === 'REJECTED').length;

    this.statsArray = [
      { label: 'Total Requests', value: this.stats.totalRequests, icon: 'bi-list-check', bg: 'bg-primary text-white' },
      { label: 'Pending', value: this.stats.pendingRequests, icon: 'bi-hourglass-split', bg: 'bg-warning text-dark' },
      { label: 'Approved', value: this.stats.approvedRequests, icon: 'bi-check-circle', bg: 'bg-success text-white' },
      { label: 'Rejected', value: this.stats.rejectedRequests, icon: 'bi-x-circle', bg: 'bg-danger text-white' }
    ];

    // Pie Chart
    this.pieChartData.datasets[0].data = [
      this.stats.approvedRequests,
      this.stats.pendingRequests,
      this.stats.rejectedRequests
    ];
    this.pieChartData.labels = [...this.pieChartLabels]; // ensures a new array reference

    // Line Chart
    const grouped: { [date: string]: number } = {};
    requests.forEach(r => {
      const day = new Date(r.requestDate).toLocaleDateString();
      grouped[day] = (grouped[day] || 0) + 1;
    });

    this.lineChartLabels = Object.keys(grouped);
    this.lineChartData.labels = [...this.lineChartLabels];
    this.lineChartData.datasets[0].data = Object.values(grouped);

    // Recent Requests
    this.recentRequests = requests
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      .slice(0, 5);

    this.lastUpdated = new Date();
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
