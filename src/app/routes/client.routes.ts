// // src/app/routes/client.routes.ts
// import { Routes } from '@angular/router';
// import { ClientLayout } from '../features/client/components/client-layout/client-layout';
// import { ClientDashboard } from '../features/client/components/client-dashboard/client-dashboard';
// import { ClientPaymentRequests } from '../features/client/components/client-payment-requests/client-payment-requests';

// export const CLIENT_ROUTES: Routes = [
//   {
//     path: '',
//     component: ClientLayout,
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       { path: 'dashboard', component: ClientDashboard },
//       { path: 'payment-requests', component: ClientPaymentRequests },
//     ],
//   },
// ];


// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
//  import { ClientDashboard } from '..//../features/client/components/client-dashboard/client-dashboard';
// import { ClientPaymentRequests } from '../features/client/components/client-payment-requests/client-payment-requests';

// const routes: Routes = [
//   {
//     path: '',
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       { path: 'dashboard', component: ClientDashboard },
//       { path: 'payment-requests', component: ClientPaymentRequests },
//     ]
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class ClientRoutingModule {}

import { Routes } from '@angular/router';
import { ClientLayout } from '../features/client/components/client-layout/client-layout';
import { ClientDashboard } from '../features/client/components/client-dashboard/client-dashboard';
import { ClientPaymentRequests } from '../features/client/components/client-payment-requests/client-payment-requests';
import { ClientPaymentHistory } from '../features/client/components/client-payment-history/client-payment-history';
import { DepositRequestComponent } from '../features/client/deposit-request/deposit-request'; 

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientLayout, 
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ClientDashboard },
      { path: 'payment-requests', component: ClientPaymentRequests },
      { path: 'payment-history', component: ClientPaymentHistory },
      { path: 'deposit-request', component: DepositRequestComponent } 
    ]
  }
];
