import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'doctor/dashboard', pathMatch: 'full' },
  {
    path: 'doctor',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./doctor/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'consultation/:id',
        loadComponent: () => import('./doctor/consultation/consultation.component').then(m => m.ConsultationComponent)
      },
      {
        path: 'lab-results',
        loadComponent: () => import('./doctor/lab-results/lab-results.component').then(m => m.LabResultsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
