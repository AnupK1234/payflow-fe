import { Component, OnInit } from '@angular/core';
import { BankAdminService } from '../../services/bank-admin.service';
import { Organization } from '../../models/organization.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.scss'],
})
export class OrganizationsListComponent implements OnInit {
  organizations: Organization[] = [];
  loading = true;
  error = '';

  constructor(private service: BankAdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.loading = true;
    this.error = '';
    this.service.listPendingOrganizations().subscribe({
      next: (data) => {
        this.organizations = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load organizations';
        this.loading = false;
        console.error(err);
      },
    });
  }

  open(org: Organization): void {
    this.router.navigate(['/bank-admin/organizations', org.id]);
  }
}
