import { Routes } from '@angular/router';
import { ReceptionistDashboardComponent } from './receptionist/dashboard/receptionist-dashboard';
import { PatientManagement } from './receptionist/patient-management/patient-management';
import { AppointmentsComponent } from './receptionist/appointments/appointments';
import { BillingComponent } from './receptionist/billing/billing';

export const routes: Routes = [
  { path: '', redirectTo: 'receptionist', pathMatch: 'full' },

  { path: 'receptionist', component: ReceptionistDashboardComponent },
  { path: 'receptionist/patients', component: PatientManagement },
  { path: 'receptionist/appointments', component: AppointmentsComponent },
  { path: 'receptionist/billing', component: BillingComponent },

  { path: '**', redirectTo: 'receptionist' }
];