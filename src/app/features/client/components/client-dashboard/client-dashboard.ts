import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService, DashboardStats } from '../../services/client.service';
import { ClientPaymentRequest } from '../../models/client-payment-request.model';

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
  clientId = Number(localStorage.getItem('userId'));
  statsArray: StatCard[] = [];
  recentRequests: ClientPaymentRequest[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Fetch recent requests
    this.clientService.getRecentRequests(this.clientId).subscribe({
      next: (res) => {
        this.recentRequests = res;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch recent requests';
        this.isLoading = false;
      },
    });

    // Fetch dashboard stats
    this.clientService.getDashboardStats(this.clientId).subscribe({
      next: (res: DashboardStats) => {
        this.statsArray = [
          { label: 'Total Requests', value: res.totalRequests, icon: 'bi bi-receipt', bg: 'bg-primary text-white' },
          { label: 'Pending', value: res.pending, icon: 'bi bi-hourglass-split', bg: 'bg-warning text-dark' },
          { label: 'Accepted', value: res.accepted, icon: 'bi bi-check-circle', bg: 'bg-success text-white' },
          { label: 'Rejected', value: res.rejected, icon: 'bi bi-x-circle', bg: 'bg-danger text-white' },
        ];
      },
      error: () => {
        this.errorMessage = 'Failed to fetch dashboard stats';
      },
    });
  }

  refreshDashboard(): void {
    this.loadDashboard();
  }
}
