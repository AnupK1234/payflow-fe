import { Routes } from '@angular/router';
import { BankAdminLayoutComponent } from '../features/bank-admin/components/bank-admin-layout/bank-admin-layout.component';

export const BANK_ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: BankAdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            '../features/bank-admin/components/bank-admin-dashboard/bank-admin-dashboard.component'
          ).then((m) => m.BankAdminDashboardComponent),
        title: 'Dashboard - Bank Admin',
      },
      {
        path: 'organizations',
        loadComponent: () =>
          import(
            '../features/bank-admin/components/organizations-list/organizations-list.component'
          ).then((m) => m.OrganizationsListComponent),
        title: 'Organizations - Bank Admin',
      },
      {
        path: 'organizations/:id',
        loadComponent: () =>
          import(
            '../features/bank-admin/components/organization-detail/organization-detail.component'
          ).then((m) => m.OrganizationDetailComponent),
        title: 'Organization Details - Bank Admin',
      },
      {
        path: 'deposit-request',
        loadComponent: () =>
          import(
            '../features/bank-admin/components/deposit-requests-list/deposit-requests-list.component'
          ).then((m) => m.DepositRequestsListComponent),
        title: 'Deposit Request - Bank Admin',
      },
      {
        path: 'salary-requests',
        loadComponent: () =>
          import(
            '../features/bank-admin/components/salary-requests-list/salary-requests-list.component'
          ).then((m) => m.SalaryRequestsListComponent),
        title: 'Salary Requests - Bank Admin',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
