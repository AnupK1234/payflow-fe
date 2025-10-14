import { Component, OnInit } from '@angular/core';
import {
  SalaryAccountRequestService,
  SalaryAccountRequest,
} from '../../services/salary-account-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salary-account-requests',
  templateUrl: './salary-account-requests.component.html',
  styleUrls: ['./salary-account-requests.component.css'],
  imports: [CommonModule],
})
export class SalaryAccountRequestsComponent implements OnInit {
  requests: SalaryAccountRequest[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private requestService: SalaryAccountRequestService) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading = true;
    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load salary account requests.';
        this.loading = false;
      },
    });
  }

  processRequest(requestId: number, approve: boolean): void {
    this.loading = true;
    this.requestService.processRequest(requestId, approve).subscribe({
      next: (res) => {
        this.successMessage = res;
        const index = this.requests.findIndex((r) => r.id === requestId);
        if (index !== -1) {
          this.requests[index].status = approve ? 'APPROVED' : 'REJECTED';
          this.requests[index].processedAt = new Date().toString(); // optional
        }

        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error while processing request.';
        this.loading = false;
      },
    });
  }
}
