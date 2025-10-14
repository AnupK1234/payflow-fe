


// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ClientService, DashboardStats } from '../../services/client.service';
// import { ClientPaymentRequest } from '../../models/client-payment-request.model';
// import { CookieService } from 'ngx-cookie-service';
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);

// interface StatCard {
//   label: string;
//   value: number;
//   icon: string;
//   bg: string;
// }

// @Component({
//   selector: 'app-client-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule, NgIf, NgForOf, AsyncPipe],
//   templateUrl: './client-dashboard.html',
//   styleUrls: ['./client-dashboard.css'],
// })
// export class ClientDashboard implements OnInit {
//   clientId = 0;
//   statsArray: StatCard[] = [];
//   recentRequests: ClientPaymentRequest[] = [];
//   isLoading = false;
//   errorMessage = '';

//   pieChart: Chart | undefined;
//   monthlyChart: Chart | undefined;

//   pieChartData = false;
//   monthlyChartData = false;

//   @ViewChild('statusPieChart') pieCanvas!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('monthlyChart') monthlyCanvas!: ElementRef<HTMLCanvasElement>;

//   constructor(
//     private clientService: ClientService,
//     private cookieService: CookieService
//   ) {}

//   ngOnInit(): void {
//     this.loadClientIdFromCookie();
//     if (!this.clientId) {
//       this.errorMessage = 'Invalid client ID. Please log in again.';
//       return;
//     }
//     this.loadDashboard();
//   }

//   private loadClientIdFromCookie(): void {
//     try {
//       const userData = this.cookieService.get('user');
//       if (userData) {
//         const user = JSON.parse(userData);
//         this.clientId = user?.clientId || 0;
//       }
//     } catch (error) {
//       console.error('Error parsing cookie:', error);
//     }
//   }

//   loadDashboard(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     // Fetch all recent requests
//     this.clientService.getRecentRequests(this.clientId).subscribe({
//       next: (res) => {
//         this.recentRequests = res;
//       },
//       error: () => (this.errorMessage = 'Failed to fetch recent requests'),
//     });

//     // Fetch dashboard stats
//     this.clientService.getDashboardStats(this.clientId).subscribe({
//       next: (res: DashboardStats) => {
//         this.statsArray = [
//           { label: 'Total Requests', value: res.totalRequests, icon: 'bi bi-receipt', bg: 'bg-primary text-white' },
//           { label: 'Pending', value: res.pending, icon: 'bi bi-hourglass-split', bg: 'bg-warning text-dark' },
//           { label: 'Accepted', value: res.accepted, icon: 'bi bi-check-circle', bg: 'bg-success text-white' },
//           { label: 'Rejected', value: res.rejected, icon: 'bi bi-x-circle', bg: 'bg-danger text-white' },
//         ];

//         this.initPieChart(res);
//         this.initMonthlyChart(res);
//         this.isLoading = false;
//       },
//       error: () => (this.errorMessage = 'Failed to fetch dashboard stats'),
//     });
//   }

//   private initPieChart(stats: DashboardStats) {
//     if (!this.pieCanvas) return;
//     if (this.pieChart) this.pieChart.destroy();

//     this.pieChart = new Chart(this.pieCanvas.nativeElement, {
//       type: 'pie',
//       data: {
//         labels: ['Pending', 'Accepted', 'Rejected', 'Paid', 'Failed'],
//         datasets: [
//           {
//             data: [stats.pending, stats.accepted, stats.rejected, stats.paid, stats.failed],
//             backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#0d6efd', '#6c757d'],
//             hoverOffset: 10,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: { position: 'bottom' },
//           title: { display: true, text: 'Payment Status Overview' },
//         },
//       },
//     });

//     this.pieChartData = true;
//   }

//   private initMonthlyChart(stats: DashboardStats) {
//     if (!this.monthlyCanvas) return;
//     if (this.monthlyChart) this.monthlyChart.destroy();

//     // Placeholder monthly data: you can replace this with real backend data
//     const monthlyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10) + 1);

//     this.monthlyChart = new Chart(this.monthlyCanvas.nativeElement, {
//       type: 'bar',
//       data: {
//         labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
//         datasets: [
//           {
//             label: 'Payments Received',
//             data: monthlyData,
//             backgroundColor: '#0d6efd',
//           },
//         ],
//       },
//       options: { responsive: true, plugins: { legend: { display: false } } },
//     });

//     this.monthlyChartData = true;
//   }

//   refreshDashboard(): void {
//     this.pieChartData = false;
//     this.monthlyChartData = false;

//     if (this.pieChart) { this.pieChart.destroy(); this.pieChart = undefined; }
//     if (this.monthlyChart) { this.monthlyChart.destroy(); this.monthlyChart = undefined; }

//     this.loadDashboard();
//   }
// }

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService, DashboardStats } from '../../services/client.service';
import { ClientPaymentRequest } from '../../models/client-payment-request.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface StatCard {
  label: string;
  value: number;
  icon: string;
  bg: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, NgForOf, AsyncPipe],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.css'],
})
export class ClientDashboard implements OnInit {
  statsArray: StatCard[] = [];
  recentRequests: ClientPaymentRequest[] = [];
  isLoading = false;
  errorMessage = '';

  pieChart: Chart | undefined;
  monthlyChart: Chart | undefined;

  pieChartData = false;
  monthlyChartData = false;

  @ViewChild('statusPieChart') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Fetch recent requests
    this.clientService.getRecentRequests().subscribe({
      next: (res) => {
        this.recentRequests = res;
        this.initMonthlyChart(); // Monthly chart based on recent requests
      },
      error: () => (this.errorMessage = 'Failed to fetch recent requests'),
    });

    // Fetch dashboard stats
    this.clientService.getDashboardStats().subscribe({
      next: (res: DashboardStats) => {
        this.statsArray = [
          { label: 'Total Requests', value: res.totalRequests, icon: 'bi bi-receipt', bg: 'bg-primary text-white' },
          { label: 'Pending', value: res.pending, icon: 'bi bi-hourglass-split', bg: 'bg-warning text-dark' },
          { label: 'Accepted', value: res.accepted, icon: 'bi bi-check-circle', bg: 'bg-success text-white' },
          { label: 'Rejected', value: res.rejected, icon: 'bi bi-x-circle', bg: 'bg-danger text-white' },
        ];

        this.initPieChart(res); // Pie chart is working
        this.isLoading = false;
      },
      error: () => (this.errorMessage = 'Failed to fetch dashboard stats'),
    });
  }

  private initPieChart(stats: DashboardStats) {
    if (!this.pieCanvas) return;
    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Accepted', 'Rejected', 'Paid', 'Failed'],
        datasets: [
          {
            data: [stats.pending, stats.accepted, stats.rejected, stats.paid, stats.failed],
            backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#0d6efd', '#6c757d'],
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Payment Status Overview' },
        },
      },
    });

    this.pieChartData = true;
  }

  private initMonthlyChart() {
    if (!this.monthlyCanvas) return;
    if (this.monthlyChart) this.monthlyChart.destroy();

    const monthlyTotals = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    this.recentRequests.forEach(req => {
      const date = new Date(req.createdAt);
      if (date.getFullYear() === currentYear && req.status === 'ACCEPTED') {
        monthlyTotals[date.getMonth()] += req.amount;
      }
    });

    this.monthlyChart = new Chart(this.monthlyCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          {
            label: 'Payments Received',
            data: monthlyTotals,
            backgroundColor: '#0d6efd',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });

    this.monthlyChartData = true;
  }

  refreshDashboard(): void {
    this.pieChartData = false;
    this.monthlyChartData = false;

    if (this.pieChart) { this.pieChart.destroy(); this.pieChart = undefined; }
    if (this.monthlyChart) { this.monthlyChart.destroy(); this.monthlyChart = undefined; }

    this.loadDashboard();
  }
}
