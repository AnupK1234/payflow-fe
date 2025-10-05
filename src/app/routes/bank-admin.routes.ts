import { Routes } from '@angular/router';
import { BankAdminLayoutComponent } from '../features/bank-admin/components/bank-admin-layout/bank-admin-layout.component';

/**
 * Bank Admin module routes
 * All routes are lazy-loaded for better performance
 */
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
      //   {
      //     path: 'organizations/create',
      //     loadComponent: () => import('./pages/organizations/organization-form.component').then(m => m.OrganizationFormComponent),
      //     title: 'Create Organization - Bank Admin'
      //   },
      //   {
      //     path: 'organizations/:id',
      //     loadComponent: () => import('./pages/organizations/organization-detail.component').then(m => m.OrganizationDetailComponent),
      //     title: 'Organization Details - Bank Admin'
      //   },
      //   {
      //     path: 'organizations/:id/edit',
      //     loadComponent: () => import('./pages/organizations/organization-form.component').then(m => m.OrganizationFormComponent),
      //     title: 'Edit Organization - Bank Admin'
      //   },
      //   {
      //     path: 'payment-requests',
      //     loadComponent: () => import('./pages/payment-requests/payment-requests-list.component').then(m => m.PaymentRequestsListComponent),
      //     title: 'Payment Requests - Bank Admin'
      //   },
      //   {
      //     path: 'payment-requests/:id',
      //     loadComponent: () => import('./pages/payment-requests/payment-request-detail.component').then(m => m.PaymentRequestDetailComponent),
      //     title: 'Payment Request Details - Bank Admin'
      //   },
      //   {
      //     path: 'salary-requests',
      //     loadComponent: () => import('./pages/salary-requests/salary-requests-list.component').then(m => m.SalaryRequestsListComponent),
      //     title: 'Salary Requests - Bank Admin'
      //   },
      //   {
      //     path: 'salary-requests/:id',
      //     loadComponent: () => import('./pages/salary-requests/salary-request-detail.component').then(m => m.SalaryRequestDetailComponent),
      //     title: 'Salary Request Details - Bank Admin'
      //   },
      //   {
      //     path: 'reports',
      //     loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
      //     title: 'Reports - Bank Admin'
      //   },
      //   {
      //     path: 'profile',
      //     loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
      //     title: 'Profile - Bank Admin'
      //   }

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
