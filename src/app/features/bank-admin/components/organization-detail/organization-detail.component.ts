import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAdminService } from '../../services/bank-admin.service';
import { Organization } from '../../models/organization.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.scss'],
  imports: [CommonModule],
})
export class OrganizationDetailComponent implements OnInit {
  organization: Organization | null = null;
  loading = true;
  verifying = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private service: BankAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? Number(idStr) : NaN;
    if (!Number.isFinite(id) || id <= 0) {
      this.loading = false;
      this.organization = null;
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
      next: (res) => {
        this.verifying = false;
        // after verification, go back to list (or update UI)
        this.router.navigate(['/bank-admin/organizations']);
      },
      error: (err) => {
        this.verifying = false;
        this.error = 'Verification failed';
        console.error(err);
      },
    });
  }
}
