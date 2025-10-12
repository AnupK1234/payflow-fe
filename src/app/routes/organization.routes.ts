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
        path: 'employees/:id',
        loadComponent: () =>
          import(
            '../features/org-admin/components/employee-details/employee-details.component'
          ).then((m) => m.EmployeeDetailsComponent),
        title: 'Employee Details',
      },
    ],
  },
];
