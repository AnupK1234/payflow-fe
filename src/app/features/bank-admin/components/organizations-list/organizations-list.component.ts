import { Component, OnInit } from '@angular/core';
import { BankAdminService } from '../../services/bank-admin.service';
import { Organization } from '../../models/organization.model';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.css'],
  imports: [NgClass],
})
export class OrganizationsListComponent implements OnInit {
  organizations: Organization[] = [];
  loading = true;
  error = '';

  constructor(private service: BankAdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllOrg();
  }

  loadAllOrg(): void {
    this.loading = true;
    this.error = '';
    this.service.listAllOrganizations().subscribe({
      next: (data) => {
        // console.log('DATA : ', data);
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
