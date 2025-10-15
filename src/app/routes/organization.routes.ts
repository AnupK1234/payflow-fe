
import { Routes } from '@angular/router';
import { OrgAdminLayoutComponent } from '../features/org-admin/components/org-admin-layout/org-admin-layout.component';

export const ORGANIZATION_ROUTES: Routes = [
  {
    path: '',
    component: OrgAdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            '../features/org-admin/components/org-admin-dashboard/org-admin-dashboard.component'
          ).then((m) => m.OrgAdminDashboardComponent),
        title: 'Dashboard - Organization',
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('../features/org-admin/components/employee-list/employee-list.component').then(
            (m) => m.EmployeesListComponent
          ),
        title: 'Employees - Organization',
      },
      {
        path: 'employees/create',
        loadComponent: () =>
          import('../features/org-admin/components/employee-create/employee-create.component').then(
            (m) => m.EmployeeCreateComponent
          ),
        title: 'Add Employee',
      },
      {
        path: 'employees/concerns',
        loadComponent: () =>
          import(
            '../features/org-admin/components/employee-concern-list/employee-concern-list.component'
          ).then((m) => m.ConcernsListComponent),
        title: 'Employee Concerns - Organization',
      },
      {
        path: 'employees/:id/salary-structures',
        loadComponent: () =>
          import(
            '../features/org-admin/components/employee-salary-structures/employee-salary-structures.component'
          ).then((m) => m.EmployeeSalaryStructuresComponent),
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import(
            '../features/org-admin/components/employee-details/employee-details.component'
          ).then((m) => m.EmployeeDetailsComponent),
        title: 'Employee Details',
      },
      {
        path: 'salary-disburement',
        loadComponent: () =>
          import(
            '../features/org-admin/components/org-salary-request-list/org-salary-request-list.component'
          ).then((m) => m.OrgSalaryRequestsListComponent),
        title: 'Salary Disburement Request',
      },
      {
        path: 'batch-create',
        loadComponent: () =>
          import(
            '../features/org-admin/components/employee-batch-upload/employee-batch-upload.component'
          ).then((m) => m.EmployeeBatchUploadComponent),
        title: 'Batch Employee Creation',
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('../features/org-admin/components/clients-list/clients-list.component').then(
            (m) => m.ClientsListComponent
          ),
        title: 'Manage Clients',
      },
      {
        path: 'clients/:id',
        loadComponent: () =>
          import('../features/org-admin/components/client-details/client-details.component').then(
            (m) => m.ClientDetailsComponent
          ),
        title: 'Client Details',
      },
      {
        path: 'client/payment-history',
        loadComponent: () =>
          import(
            '../features/org-admin/components/client-payment-history/client-payment-history'
          ).then((m) => m.ClientPaymentHistoryComponent),
        title: 'Client Payment History',
      },
      {
        path: 'salary-account-requests',
        loadComponent: () =>
          import('../features/org-admin/components/salary-account-requests/salary-account-requests.component').then(
            (m) => m.SalaryAccountRequestsComponent
          ),
        title: 'Salary Account Request',
      },

      // ✅ New Deposit Request Route
      {
        path: 'deposit-request',
        loadComponent: () =>
          import(
            '../features/org-admin/components/deposit-request/deposit-request'
          ).then((m) => m.RequestDepositComponent),
        title: 'Raise Deposit Request',
      },
    ],
  },
];
