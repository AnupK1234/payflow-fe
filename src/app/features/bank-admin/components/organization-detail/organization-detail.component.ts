import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { BankAdminService } from '../../services/bank-admin.service';
import { Organization } from '../../models/organization.model';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.scss'],
})
export class OrganizationDetailComponent implements OnInit {
  organization: Organization | null = null;
  loading = true;
  verifying = false;
  error = '';
  showBankDetails = false; // 👈 added this

  constructor(
    private route: ActivatedRoute,
    private service: BankAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.loading = false;
      return;
    }

    this.service.getOrganization(id).subscribe({
      next: (o) => {
        this.organization = o;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load organization';
        this.loading = false;
        console.error(err);
      },
    });
  }

  verify(approve: boolean): void {
    if (!this.organization) return;
    this.verifying = true;
    this.service.verifyOrganization({ organizationId: this.organization.id, approve }).subscribe({
      next: () => {
        this.verifying = false;
        this.router.navigate(['/bank-admin/organizations']);
      },
      error: (err) => {
        this.verifying = false;
        this.error = 'Verification failed';
        console.error(err);
      },
    });
  }

  updateStatus(newStatus: 'VERIFIED' | 'SUSPENDED'): void {
    if (!this.organization) return;

    // Prevent action if status is already the target status
    if (this.organization.status === newStatus) {
      this.error = `Organization is already ${newStatus}.`;
      return;
    }

    this.verifying = true; // Reusing this flag for all actions
    this.error = '';

    const organizationId = this.organization.id;

    // Calls the PUT /organizations/{id}/status endpoint
    this.service.updateOrganizationStatus(organizationId, newStatus).subscribe({
      next: (updatedOrg) => {
        this.verifying = false;
        // Update the local component state with the new organization data
        this.organization = updatedOrg; 
      },
      error: (err) => {
        this.verifying = false;
        // Extract a meaningful message from the error (like the IllegalStateException message)
        const errorMessage = err.error?.message || 'Status update failed';
        this.error = errorMessage;
        console.error(err);
      },
    });
  }
}
