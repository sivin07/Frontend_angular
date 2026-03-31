import { Routes } from '@angular/router';
import { ReceptionistDashboard } from './receptionist/dashboard/receptionist-dashboard';
import { PatientManagement } from './receptionist/patient-management/patient-management';
import { AppointmentsComponent } from './receptionist/appointments/appointments';
import { BillingComponent } from './receptionist/billing/billing';

import { LoginComponent } from './auth/login/login';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'receptionist',
    component: ReceptionistDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Receptionist' }
  },
  {
    path: 'receptionist/patients',
    component: PatientManagement,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Receptionist' }
  },
  {
    path: 'receptionist/appointments',
    component: AppointmentsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Receptionist' }
  },
  {
    path: 'receptionist/billing',
    component: BillingComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Receptionist' }
  },

  { path: '**', redirectTo: 'login' }
];