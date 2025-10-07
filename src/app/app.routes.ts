import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

/**
 * Main application routes configuration
 * Using lazy loading for better performance and code splitting
 */
export const routes: Routes = [
  // Home route - loads immediately
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'PayFlow - Payment and Payroll Management System'
  },

  // Authentication routes
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login - PayFlow'
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent),
    title: 'Sign Up - PayFlow'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Forgot Password - PayFlow'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'Reset Password - PayFlow'
  },
  
  // Bank Admin routes - with auth guard
  {
    path: 'bank-admin',
    loadChildren: () => import('./routes/bank-admin.routes').then(m => m.BANK_ADMIN_ROUTES),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'BANK_ADMIN' }
  },

  // Organization routes - with auth guard
//   {
//     path: 'organization',
//     loadChildren: () => import('./modules/organization/organization.routes').then(m => m.ORGANIZATION_ROUTES),
//     // canActivate: [AuthGuard, RoleGuard],
//     // data: { role: 'ORGANIZATION' }
//   },

  // Employee routes - with auth guard
//   {
//     path: 'employee',
//     loadChildren: () => import('./modules/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES),
//     // canActivate: [AuthGuard, RoleGuard],
//     // data: { role: 'EMPLOYEE' }
//   },

  // Error pages
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/errors/unauthorized/unauthorized').then(m => m.Unauthorized),
    title: 'Unauthorized - PayFlow'
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/errors/not-found/not-found').then(m => m.NotFound),
    title: 'Page Not Found - PayFlow'
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: 'not-found'
  }
];