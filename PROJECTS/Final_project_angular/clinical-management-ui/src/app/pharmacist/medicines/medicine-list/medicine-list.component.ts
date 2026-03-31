import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PharmacistService } from '../../../services/pharmacist.service';
import { Medicine } from '../../../models/pharmacist.model';
import { AddEditMedicineModalComponent } from '../add-edit-medicine/add-edit-medicine.component';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEditMedicineModalComponent],
  providers: [CurrencyPipe],
  template: `
    <div class="card shadow-sm border-0 mb-4 rounded-4">
      <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 class="fw-bold mb-1">Medicine Inventory</h4>
          <p class="text-muted small mb-0">Manage stock levels, pricing, and expiry dates.</p>
        </div>
        <button class="btn btn-danger text-white rounded-pill px-4 shadow-sm" (click)="openAddModal()">
          <i class="bi bi-plus-lg me-1"></i> Add Medicine
        </button>
      </div>
      <div class="card-body px-4 py-4">
        
        <div class="row mb-4">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input type="text" class="form-control border-start-0 bg-light" [(ngModel)]="searchTerm" placeholder="Search by medicine name...">
            </div>
          </div>
          <div class="col-md-7 text-md-end mt-3 mt-md-0 d-flex align-items-center justify-content-md-end">
            <span class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill d-inline-flex align-items-center">
              <span class="spinner-grow spinner-grow-sm text-danger me-2" role="status" style="width:0.5rem; height:0.5rem;" aria-hidden="true"></span>
              Red rows indicate low stock (< 10)
            </span>
          </div>
        </div>

        <div class="table-responsive rounded-3 border">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-3 border-bottom-0">Medicine Name</th>
                <th class="border-bottom-0 text-center">Stock Quantity</th>
                <th class="border-bottom-0 text-end">Price</th>
                <th class="border-bottom-0">Expiry Date</th>
                <th class="text-end pe-3 border-bottom-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="isLoading" class="text-center">
                <td colspan="5" class="py-4">
                  <div class="spinner-border text-danger spinner-border-sm me-2" role="status"></div> Loading stock...
                </td>
              </tr>
              <tr *ngIf="!isLoading && filteredMedicines.length === 0" class="text-center">
                <td colspan="5" class="py-4 text-muted">No medicines found in inventory.</td>
              </tr>
              <tr *ngFor="let m of filteredMedicines" [ngClass]="{'table-danger bg-opacity-10': m.stock < 10}">
                <td class="ps-3 fw-bold">
                  {{m.name}} 
                  <span *ngIf="m.stock < 10" class="badge bg-danger rounded-pill ms-2" style="font-size: 0.65em;">LOW STOCK</span>
                </td>
                <td class="text-center">
                  <span class="px-3 py-1 rounded-pill" [ngClass]="m.stock < 10 ? 'bg-danger text-white' : 'bg-light text-dark fw-medium'">
                    {{m.stock}}
                  </span>
                </td>
                <td class="text-end fw-bold">{{m.price | currency:'INR'}}</td>
                <td class="text-muted" [ngClass]="{'text-danger fw-bold': isExpired(m.expiryDate)}">
                  {{m.expiryDate | date:'mediumDate'}}
                  <span *ngIf="isExpired(m.expiryDate)" class="text-danger ms-1" style="font-size: 0.8em;">(Expired)</span>
                </td>
                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-outline-secondary rounded-circle me-2 p-2" title="Edit" (click)="openEditModal(m)">
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger rounded-circle p-2" title="Delete" (click)="deleteMedicine(m.id!)">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-add-edit-medicine-modal 
      *ngIf="showModal"
      [medicine]="selectedMedicine"
      (close)="closeModal()"
      (save)="saveMedicine($event)">
    </app-add-edit-medicine-modal>
  `
})
export class MedicineListComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  isLoading = false;
  
  _searchTerm = '';
  get searchTerm(): string { return this._searchTerm; }
  set searchTerm(val: string) {
    this._searchTerm = val;
    this.filterData();
  }

  showModal = false;
  selectedMedicine: Medicine | null = null;
  today = new Date();

  constructor(
    private pharmacistService: PharmacistService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadMedicines();
  }

  loadMedicines() {
    this.isLoading = true;
    this.pharmacistService.getMedicines().subscribe({
      next: (res) => {
        this.medicines = res || [];
        this.filterData();
        this.isLoading = false;
        
        // Check for low stock to show warning
        const lowStockCount = this.medicines.filter(m => m.stock < 10).length;
        if (lowStockCount > 0) {
          this.toastr.warning(`${lowStockCount} item(s) are low on stock!`, 'Stock Alert');
        }
      },
      error: () => {
        this.toastr.error('Error loading inventory');
        this.isLoading = false;
      }
    });
  }

  filterData() {
    if (!this.searchTerm) {
      this.filteredMedicines = [...this.medicines];
      return;
    }
    const lower = this.searchTerm.toLowerCase();
    this.filteredMedicines = this.medicines.filter(m => 
      m.name.toLowerCase().includes(lower)
    );
  }

  isExpired(dateStr: string): boolean {
    return new Date(dateStr) < this.today;
  }

  openAddModal() {
    this.selectedMedicine = null;
    this.showModal = true;
  }

  openEditModal(med: Medicine) {
    this.selectedMedicine = med;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedMedicine = null;
  }

  saveMedicine(med: Medicine) {
    if (this.selectedMedicine && this.selectedMedicine.id) {
      // Update
      this.pharmacistService.updateMedicine(this.selectedMedicine.id, med).subscribe({
        next: () => {
          this.toastr.success('Medicine updated successfully!');
          this.closeModal();
          this.loadMedicines();
        },
        error: () => this.toastr.error('Failed to update medicine.')
      });
    } else {
      // Add
      this.pharmacistService.addMedicine(med).subscribe({
        next: () => {
          this.toastr.success('Medicine added successfully!');
          this.closeModal();
          this.loadMedicines();
        },
        error: () => this.toastr.error('Failed to add medicine.')
      });
    }
  }

  deleteMedicine(id: number) {
    if (confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      this.pharmacistService.deleteMedicine(id).subscribe({
        next: () => {
          this.toastr.success('Medicine deleted.');
          this.loadMedicines();
        },
        error: () => this.toastr.error('Failed to delete medicine.')
      });
    }
  }
}
