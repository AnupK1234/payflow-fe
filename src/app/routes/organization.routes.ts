import { Routes } from '@angular/router';
import { OrgAdminLayoutComponent } from '../features/org-admin/components/org-admin-layout/org-admin-layout.component';

/**
 * Organization module routes
 * All routes are lazy-loaded for better performance
 */
export const ORGANIZATION_ROUTES: Routes = [
  {
    path: '',
    component: OrgAdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../features/org-admin/components/org-admin-dashboard/org-admin-dashboard.component').then(m => m.OrgAdminDashboardComponent),
        title: 'Dashboard - Organization'
      },
      {
        path: 'employees',
        loadComponent: () => import('../features/org-admin/components/employee-list/employee-list.component').then(m => m.EmployeesListComponent),
        title: 'Employees - Organization'
      },
      {
        path: 'employees/create',
        loadComponent: () => import('../features/org-admin/components/employee-create/employee-create.component').then(m => m.EmployeeCreateComponent),
        title: 'Add Employee'
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('../features/org-admin/components/employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent),
        title: 'Employee Details'
      },
    //   {
    //     path: 'employees/:id/edit',
    //     loadComponent: () => import('./pages/employees/employee-form.component').then(m => m.EmployeeFormComponent),
    //     title: 'Edit Employee - Organization'
    //   },
    //   {
    //     path: 'employees/:id/salary',
    //     loadComponent: () => import('./pages/employees/employee-salary.component').then(m => m.EmployeeSalaryComponent),
    //     title: 'Employee Salary - Organization'
    //   },
    //   {
    //     path: 'clients-vendors',
    //     loadComponent: () => import('./pages/clients-vendors/clients-vendors-list.component').then(m => m.ClientsVendorsListComponent),
    //     title: 'Clients & Vendors - Organization'
    //   },
    //   {
    //     path: 'clients-vendors/create',
    //     loadComponent: () => import('./pages/clients-vendors/client-vendor-form.component').then(m => m.ClientVendorFormComponent),
    //     title: 'Add Client/Vendor - Organization'
    //   },
    //   {
    //     path: 'clients-vendors/:id/edit',
    //     loadComponent: () => import('./pages/clients-vendors/client-vendor-form.component').then(m => m.ClientVendorFormComponent),
    //     title: 'Edit Client/Vendor - Organization'
    //   },
    //   {
    //     path: 'salary-disbursal',
    //     loadComponent: () => import('./pages/salary-disbursal/salary-disbursal.component').then(m => m.SalaryDisbursalComponent),
    //     title: 'Salary Disbursal - Organization'
    //   },
    //   {
    //     path: 'payment-requests',
    //     loadComponent: () => import('./pages/payment-requests/payment-requests-list.component').then(m => m.PaymentRequestsListComponent),
    //     title: 'Payment Requests - Organization'
    //   },
    //   {
    //     path: 'payment-requests/create',
    //     loadComponent: () => import('./pages/payment-requests/payment-request-form.component').then(m => m.PaymentRequestFormComponent),
    //     title: 'Create Payment Request - Organization'
    //   },
    //   {
    //     path: 'employee-concerns',
    //     loadComponent: () => import('./pages/employee-concerns/employee-concerns-list.component').then(m => m.EmployeeConcernsListComponent),
    //     title: 'Employee Concerns - Organization'
    //   },
    //   {
    //     path: 'employee-concerns/:id',
    //     loadComponent: () => import('./pages/employee-concerns/employee-concern-detail.component').then(m => m.EmployeeConcernDetailComponent),
    //     title: 'Concern Details - Organization'
    //   },
    //   {
    //     path: 'reports',
    //     loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    //     title: 'Reports - Organization'
    //   },
    //   {
    //     path: 'profile',
    //     loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    //     title: 'Profile - Organization'
    //   }
    ]
  }
];