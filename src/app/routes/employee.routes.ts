// import { Routes } from '@angular/router';

// /**
//  * Employee module routes
//  * All routes are lazy-loaded for better performance
//  */
// export const EMPLOYEE_ROUTES: Routes = [
//   {
//     path: '',
//     loadComponent: () => import('./layout/employee-layout.component').then(m => m.EmployeeLayoutComponent),
//     children: [
//       {
//         path: '',
//         redirectTo: 'dashboard',
//         pathMatch: 'full'
//       },
//       {
//         path: 'dashboard',
//         loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
//         title: 'Dashboard - Employee'
//       },
//       {
//         path: 'salary-history',
//         loadComponent: () => import('./pages/salary-history/salary-history.component').then(m => m.SalaryHistoryComponent),
//         title: 'Salary History - Employee'
//       },
//       {
//         path: 'salary-history/:id',
//         loadComponent: () => import('./pages/salary-history/salary-slip-detail.component').then(m => m.SalarySlipDetailComponent),
//         title: 'Salary Slip - Employee'
//       },
//       {
//         path: 'bank-account',
//         loadComponent: () => import('./pages/bank-account/bank-account.component').then(m => m.BankAccountComponent),
//         title: 'Bank Account - Employee'
//       },
//       {
//         path: 'concerns',
//         loadComponent: () => import('./pages/concerns/concerns-list.component').then(m => m.ConcernsListComponent),
//         title: 'My Concerns - Employee'
//       },
//       {
//         path: 'concerns/create',
//         loadComponent: () => import('./pages/concerns/concern-form.component').then(m => m.ConcernFormComponent),
//         title: 'Raise Concern - Employee'
//       },
//       {
//         path: 'concerns/:id',
//         loadComponent: () => import('./pages/concerns/concern-detail.component').then(m => m.ConcernDetailComponent),
//         title: 'Concern Details - Employee'
//       },
//       {
//         path: 'profile',
//         loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
//         title: 'Profile - Employee'
//       }
//     ]
//   }
// ];


import { Routes } from '@angular/router';
import { EmployeeLayoutComponent } from '../features/employee/components/employee-layout/employee-layout';
import { EmployeeDashboardComponent } from '../features/employee/components/employee-dashboard/employee-dashboard';
import { EmployeeSalaryHistoryComponent } from '../features/employee/components/employee-salary-history/employee-salary-history';
import { UpdateAccountComponent } from '../features/employee/components/update-account/update-account';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: EmployeeLayoutComponent,
    children: [
      { path: 'dashboard', component: EmployeeDashboardComponent },
      { path: 'salary-history', component: EmployeeSalaryHistoryComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
       { path: 'update-account', component: UpdateAccountComponent } 
    ]
  }
];
