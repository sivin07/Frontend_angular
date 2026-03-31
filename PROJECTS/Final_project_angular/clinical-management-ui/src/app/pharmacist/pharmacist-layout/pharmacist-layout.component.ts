import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-pharmacist-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex flex-column vh-100">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-3">
        <a class="navbar-brand fw-bold" href="#" routerLink="/pharmacist/dashboard">
          <i class="bi bi-capsule me-2"></i>Pharmacist Module
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#pharmacistNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="pharmacistNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/pharmacist/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/pharmacist/prescriptions" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active">Pending Prescriptions</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/pharmacist/prescriptions/completed" routerLinkActive="active">Completed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/pharmacist/bills" routerLinkActive="active">Bills</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/pharmacist/medicines" routerLinkActive="active">Medicines</a>
            </li>
            <li class="nav-item ms-lg-3">
              <button class="btn btn-outline-light btn-sm mt-1" (click)="logout()">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow-1 overflow-auto bg-light p-4">
        <div class="container-fluid">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class PharmacistLayoutComponent {
  constructor(private router: Router) {}
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
