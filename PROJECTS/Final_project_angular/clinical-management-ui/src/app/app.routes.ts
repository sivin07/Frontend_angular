import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { ReceptionComponent } from './auth/reception-dashboard/reception-dashboard';
import { DoctorComponent } from './auth/doctor-dashboard/doctor-dashboard';
import { PharmacistComponent } from './auth/pharmacist-dashboard/pharmacist-dashboard';
import { LabtechComponent } from './auth/labtech-dashboard/labtech-dashboard';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard/reception', 
    component: ReceptionComponent, 
    canActivate: [authGuard, roleGuard],
    data: { role: 'Receptionist' }
  },
  { 
    path: 'dashboard/doctor', 
    component: DoctorComponent, 
    canActivate: [authGuard, roleGuard],
    data: { role: 'Doctor' }
  },
  { 
    path: 'dashboard/pharmacist', 
    component: PharmacistComponent, 
    canActivate: [authGuard, roleGuard],
    data: { role: 'Pharmacist' }
  },
  { 
    path: 'dashboard/labtech', 
    component: LabtechComponent, 
    canActivate: [authGuard, roleGuard],
    data: { role: 'LabTechnician' }
  },
  { path: '**', redirectTo: 'login' }
];
