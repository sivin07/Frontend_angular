import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PharmacistService } from '../../services/pharmacist.service';
import { Bill } from '../../models/pharmacist.model';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CurrencyPipe],
  template: `
    <div class="card shadow-sm border-0 mb-4 rounded-4">
      <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 class="fw-bold mb-1">Pharmacist Bills</h4>
          <p class="text-muted small mb-0">Manage generated bills for completed prescriptions.</p>
        </div>
      </div>
      <div class="card-body px-4 py-4">
        
        <div class="row mb-4">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input type="text" class="form-control border-start-0 bg-light" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)" placeholder="Search by patient, phone or Bill ID...">
            </div>
          </div>
        </div>

        <div class="table-responsive rounded-3 border">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-3 border-bottom-0">Bill ID</th>
                <th class="border-bottom-0">Patient Name</th>
                <th class="border-bottom-0 text-end">Amount</th>
                <th class="border-bottom-0">Date</th>
                <th class="text-end pe-3 border-bottom-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="isLoading" class="text-center">
                <td colspan="5" class="py-4">
                  <div class="spinner-border text-info spinner-border-sm me-2" role="status"></div> Loading bills...
                </td>
              </tr>
              <tr *ngIf="!isLoading && bills.length === 0" class="text-center">
                <td colspan="5" class="py-4 text-muted">No bills found matching your criteria.</td>
              </tr>
              <tr *ngFor="let b of bills">
                <td class="ps-3 text-muted fw-medium">#{{b.id}}</td>
                <td class="fw-bold">{{b.patientName}}</td>
                <td class="text-end text-success fw-bold">{{b.amount | currency:'INR'}}</td>
                <td class="text-muted">{{b.date | date:'mediumDate'}}</td>
                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-outline-info rounded-pill px-3 me-2" (click)="viewBill(b.id)">
                    <i class="bi bi-eye"></i> View
                  </button>
                  <button class="btn btn-sm btn-info text-white rounded-pill px-3" (click)="printBill(b.id)">
                    <i class="bi bi-printer"></i> Print
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BillsComponent implements OnInit {
  bills: Bill[] = [];
  isLoading = false;
  
  searchTerm = '';
  searchTimeout: any;

  constructor(
    private pharmacistService: PharmacistService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadBills();
  }

  loadBills() {
    this.isLoading = true;
    this.pharmacistService.getBills(this.searchTerm).subscribe({
      next: (res) => {
        this.bills = res || [];
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error loading bills');
        this.isLoading = false;
      }
    });
  }

  onSearchChange(value: string) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.loadBills();
    }, 500); // 500ms debounce
  }

  viewBill(id: number) {
    this.toastr.info('Viewing bill details for #' + id);
  }

  printBill(id: number) {
    this.toastr.info('Opening print dialog for bill #' + id);
    window.print();
  }
}
