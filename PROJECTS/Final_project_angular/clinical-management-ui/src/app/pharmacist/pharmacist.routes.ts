import { Routes } from '@angular/router';
import { BillsComponent } from './bills/bills.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedicineListComponent } from './medicines/medicine-list/medicine-list.component';
import { PharmacistLayoutComponent } from './pharmacist-layout/pharmacist-layout.component';
import { PrescriptionCompletedComponent } from './prescription-completed/prescription-completed.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';

export const PHARMACIST_ROUTES: Routes = [
  {
    path: '',
    component: PharmacistLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'prescriptions', component: PrescriptionListComponent },
      { path: 'prescriptions/completed', component: PrescriptionCompletedComponent },
      { path: 'bills', component: BillsComponent },
      { path: 'medicines', component: MedicineListComponent }
    ]
  }
];
