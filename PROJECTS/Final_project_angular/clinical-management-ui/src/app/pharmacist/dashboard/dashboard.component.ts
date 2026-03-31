import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pharmacist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="fw-bold">Pharmacist Dashboard</h2>
        <p class="text-muted">Welcome back! Manage prescriptions, bills, and inventory from here.</p>
      </div>
    </div>

    <div class="row g-4">
      <!-- Pending Prescriptions -->
      <div class="col-lg-3 col-md-6">
        <div class="card shadow-sm h-100 border-0 rounded-4 card-hover">
          <div class="card-body p-4 text-center">
            <div class="icon-circle bg-warning text-white mb-3 mx-auto">
              <i class="bi bi-file-medical-fill fs-2"></i>
            </div>
            <h5 class="card-title fw-bold">View Prescriptions</h5>
            <p class="card-text text-muted mb-4">Process and issue medicines for pending requests.</p>
            <a routerLink="/pharmacist/prescriptions" class="btn btn-warning w-100 rounded-pill">Manage Pending</a>
          </div>
        </div>
      </div>

      <!-- Completed Prescriptions -->
      <div class="col-lg-3 col-md-6">
        <div class="card shadow-sm h-100 border-0 rounded-4 card-hover">
          <div class="card-body p-4 text-center">
            <div class="icon-circle bg-success text-white mb-3 mx-auto">
              <i class="bi bi-check-circle-fill fs-2"></i>
            </div>
            <h5 class="card-title fw-bold">Completed Prescriptions</h5>
            <p class="card-text text-muted mb-4">View issued and completed prescription histories.</p>
            <a routerLink="/pharmacist/prescriptions/completed" class="btn btn-success w-100 rounded-pill">View History</a>
          </div>
        </div>
      </div>

      <!-- View Bills -->
      <div class="col-lg-3 col-md-6">
        <div class="card shadow-sm h-100 border-0 rounded-4 card-hover">
          <div class="card-body p-4 text-center">
            <div class="icon-circle bg-info text-white mb-3 mx-auto">
              <i class="bi bi-cash-stack fs-2"></i>
            </div>
            <h5 class="card-title fw-bold">View Bills</h5>
            <p class="card-text text-muted mb-4">Access generated bills and financial records.</p>
            <a routerLink="/pharmacist/bills" class="btn btn-info text-white w-100 rounded-pill">Manage Bills</a>
          </div>
        </div>
      </div>

      <!-- Medicine Management -->
      <div class="col-lg-3 col-md-6">
        <div class="card shadow-sm h-100 border-0 rounded-4 card-hover">
          <div class="card-body p-4 text-center">
            <div class="icon-circle bg-danger text-white mb-3 mx-auto">
              <i class="bi bi-boxes fs-2"></i>
            </div>
            <h5 class="card-title fw-bold">Medicine Inventory</h5>
            <p class="card-text text-muted mb-4">Manage stock levels, add new drugs, and monitor expiry.</p>
            <a routerLink="/pharmacist/medicines" class="btn btn-danger w-100 rounded-pill">Manage Stock</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card-hover:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class DashboardComponent {}
