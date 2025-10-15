import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, interval, switchMap, finalize } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { BankAdminService } from '../../services/bank-admin.service';
import { Organization } from '../../models/organization.model';
import { PageResponse } from '../../models/salary-request.model';

Chart.register(...registerables);

type StatusType = 'APPROVED' | 'REJECTED' | 'PENDING';

@Component({
  selector: 'app-bank-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-admin-dashboard.component.html',
  styleUrls: ['./bank-admin-dashboard.component.css']
})
export class BankAdminDashboardComponent implements OnInit {

  stats = {
    totalOrganizations: 0,
    pendingVerifications: 0,
    approvedPayments: 0,
    rejectedRequests: 0
  };

  statsArray: { label: string, value: string | number, icon: string, bg: string }[] = [];
  recentActivities: any[] = [];
  recentRequests: any[] = [];
  monthlyChartData: any = null;
  pieChartData: any = null;

  lastUpdated: Date = new Date();
  loading = false;
  chart: any;
  pieChart: any;
  chartFilter: string = '30';

  constructor(private adminService: BankAdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();

    interval(30000)
      .pipe(switchMap(() => this.fetchData()))
      .subscribe({
        next: ({ orgs, pending, salary }) => {
          this.processData(orgs, pending, salary);
          this.showToast();
        },
        error: err => console.error('Error updating dashboard:', err)
      });
  }

  loadDashboardData(): void {
    this.fetchData().subscribe({
      next: ({ orgs, pending, salary }) => {
        this.processData(orgs, pending, salary);
      },
      error: err => console.error('Error loading dashboard:', err)
    });
  }

  fetchData() {
    this.loading = true;
    return forkJoin({
      orgs: this.adminService.listAllOrganizations(),
      pending: this.adminService.listPendingOrganizations(),
      salary: this.adminService.getSalaryRequests('ALL', 0, 100)
    }).pipe(finalize(() => this.loading = false));
  }

  processData(orgs: Organization[], pending: Organization[], salary: PageResponse) {
    this.stats.totalOrganizations = orgs.length;
    this.stats.pendingVerifications = pending.length;

    const salaryData = salary?.content || [];

   
    this.stats.approvedPayments = salaryData.filter((req: any) => req.status === 'APPROVED').length;
    this.stats.rejectedRequests = salaryData.filter((req: any) => req.status === 'REJECTED').length;

    
    this.statsArray = [
      { label: 'Total Organizations', value: this.stats.totalOrganizations, icon: 'bi-buildings', bg: 'bg-primary text-white' },
      { label: 'Pending Verifications', value: this.stats.pendingVerifications, icon: 'bi-hourglass-split', bg: 'bg-warning text-dark' },
      { label: 'Approved Payments', value: this.stats.approvedPayments, icon: 'bi-cash-stack', bg: 'bg-success text-white' },
      { label: 'Rejected Requests', value: this.stats.rejectedRequests, icon: 'bi-x-circle', bg: 'bg-danger text-white' }
    ];

   
    this.recentActivities = salaryData
      .sort((a: any, b: any) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      .slice(0, 5)
      .map(req => ({
        organization: `Org-${req.organizationId}`, 
        action: 'Salary Disbursement',
        amount: '₹0', 
        date: new Date(req.requestDate).toDateString(),
        status: req.status as StatusType
      }));

    this.recentRequests = salaryData
      .sort((a: any, b: any) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      .slice(0, 5);

    
    this.monthlyChartData = salaryData.length ? salaryData : null;
    this.pieChartData = this.recentActivities.length ? this.recentActivities : null;

    this.updatePaymentChart(salaryData);
    this.loadPieChart(this.recentActivities);

    this.lastUpdated = new Date();
  }

  updatePaymentChart(salaryData: any[]): void {
    const filteredData = this.applyChartFilter(salaryData);
    const useDay = this.chartFilter !== 'all' && Number(this.chartFilter) <= 30;

    const labelsMap: { [label: string]: number } = {};
    filteredData.forEach((req: any) => {
      if (req.status !== 'APPROVED') return;
      const date = new Date(req.requestDate);
      const label = useDay 
        ? date.toLocaleDateString('default', { day: 'numeric', month: 'short' })
        : date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      labelsMap[label] = (labelsMap[label] || 0) + 1; // using count
    });

    const labels = Object.keys(labelsMap);
    const values = Object.values(labelsMap);

    this.monthlyChartData = { labels, values };

    if (this.chart) this.chart.destroy();
    const ctx = document.querySelector('#paymentChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Approved Requests', data: values, borderColor: '#007bff', backgroundColor: 'rgba(0,123,255,0.2)', tension: 0.3, fill: true }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
    });
  }

  applyChartFilter(data: any[]): any[] {
    if (this.chartFilter === 'all') return data;
    const days = Number(this.chartFilter);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return data.filter(req => new Date(req.requestDate) >= cutoff);
  }

  loadPieChart(recentActivities: any[]): void {
    if (this.pieChart) this.pieChart.destroy();

    const statusCounts: Record<StatusType, number> = { APPROVED: 0, REJECTED: 0, PENDING: 0 };
    recentActivities.forEach(act => {
      const status = act.status as StatusType;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    this.pieChartData = statusCounts;

    const ctx = document.querySelector('#activityPieChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: { labels: ['APPROVED', 'REJECTED', 'PENDING'], datasets: [{ data: [statusCounts.APPROVED, statusCounts.REJECTED, statusCounts.PENDING], backgroundColor: ['#198754', '#dc3545', '#ffc107'] }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.chartFilter = select.value;
    this.loadDashboardData();
  }

  showToast(): void {
    const toastEl = document.getElementById('updateToast');
    if (toastEl) {
      const toast = new (window as any).bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    this.showToast();
  }
}
