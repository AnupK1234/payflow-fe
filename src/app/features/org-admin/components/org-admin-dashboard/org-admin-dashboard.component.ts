
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { forkJoin, interval, switchMap, finalize } from "rxjs";
import { OrgSalaryRequestsService } from '../../services/salary-request.service';
import { SalaryDisbursementRequest } from "../../models/salary-filters.interface";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-org-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgChartsModule, RouterLink],
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

  public pieChartLabels: string[] = ['Approved', 'Pending', 'Rejected'];
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: this.pieChartLabels,
    datasets: [{ 
      data: [0, 0, 0], 
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      hoverBackgroundColor: ['#218838', '#e0a800', '#c82333']
    }]
  };
  public pieChartOptions: ChartOptions<'pie'> = { 
    responsive: true,
    maintainAspectRatio: false
  };

  public lineChartLabels: string[] = [];
  public lineChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Requests per Day', 
        fill: true, 
        tension: 0.3,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderColor: '#007bff',
        pointBackgroundColor: '#007bff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#007bff'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = { 
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  constructor(private salaryService: OrgSalaryRequestsService) {}

  ngOnInit(): void {
    this.loadDashboardData();

   
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

    
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: [
          this.stats.approvedRequests,
          this.stats.pendingRequests,
          this.stats.rejectedRequests
        ]
      }]
    };

  
    this.updateLineChartData(requests);

   
    this.recentRequests = requests
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      .slice(0, 5);

    this.lastUpdated = new Date();
  }

  private updateLineChartData(requests: SalaryDisbursementRequest[]): void {
    
    const grouped: { [date: string]: number } = {};
    
    requests.forEach(r => {
      
      const date = new Date(r.requestDate);
      if (!isNaN(date.getTime())) { 
        const day = date.toISOString().split('T')[0]; 
        grouped[day] = (grouped[day] || 0) + 1;
      }
    });

    
    const sortedDates = Object.keys(grouped).sort();
    
    
    this.lineChartLabels = sortedDates.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const lineData = sortedDates.map(date => grouped[date]);

   
    this.lineChartData = {
      labels: [...this.lineChartLabels],
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: [...lineData]
        }
      ]
    };
  }

  
  refreshDashboard(): void {
    this.loadDashboardData();
  }
}