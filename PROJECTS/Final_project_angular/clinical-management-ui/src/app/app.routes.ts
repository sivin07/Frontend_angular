import { Routes } from '@angular/router';
import { ReceptionistDashboard } from './receptionist/dashboard/receptionist-dashboard';
import { PatientManagement } from './receptionist/patient-management/patient-management';
import { AppointmentsComponent } from './receptionist/appointments/appointments';
import { BillingComponent } from './receptionist/billing/billing';

export const routes: Routes = [
  { path: 'receptionist', component: ReceptionistDashboard },
  { path: 'receptionist/patients', component: PatientManagement },
  { path: 'receptionist/appointments', component: AppointmentsComponent },
  { path: 'receptionist/billing', component: BillingComponent },
  { path: '', redirectTo: 'receptionist', pathMatch: 'full' }
];