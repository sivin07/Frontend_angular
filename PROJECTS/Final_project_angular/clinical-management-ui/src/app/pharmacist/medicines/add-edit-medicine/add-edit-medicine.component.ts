import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medicine } from '../../../models/pharmacist.model';

@Component({
  selector: 'app-add-edit-medicine-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-capsule me-2 text-danger"></i>
              {{ isEdit ? 'Edit Medicine' : 'Add New Medicine' }}
            </h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="medicineForm" (ngSubmit)="onSubmit()">
              
              <div class="mb-3">
                <label class="form-label fw-medium text-muted small">Medicine Name</label>
                <input type="text" class="form-control bg-light border-0 py-2" formControlName="name" placeholder="E.g., Paracetamol 500mg" [ngClass]="{'is-invalid': f['name'].invalid && f['name'].touched}">
                <div *ngIf="f['name'].invalid && f['name'].touched" class="invalid-feedback">
                  Medicine name is required.
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6 mb-3 mb-md-0">
                  <label class="form-label fw-medium text-muted small">Stock Quantity</label>
                  <input type="number" class="form-control bg-light border-0 py-2" formControlName="stock" min="0" placeholder="0" [ngClass]="{'is-invalid': f['stock'].invalid && f['stock'].touched}">
                  <div *ngIf="f['stock'].errors?.['required'] && f['stock'].touched" class="invalid-feedback">
                    Stock is required.
                  </div>
                  <div *ngIf="f['stock'].errors?.['min'] && f['stock'].touched" class="invalid-feedback">
                    Stock cannot be negative.
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium text-muted small">Price (INR)</label>
                  <input type="number" class="form-control bg-light border-0 py-2" formControlName="price" min="0.01" step="0.01" placeholder="0.00" [ngClass]="{'is-invalid': f['price'].invalid && f['price'].touched}">
                  <div *ngIf="f['price'].errors?.['required'] && f['price'].touched" class="invalid-feedback">
                    Price is required.
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-medium text-muted small">Expiry Date</label>
                <input type="date" class="form-control bg-light border-0 py-2" formControlName="expiryDate" [min]="today" [ngClass]="{'is-invalid': f['expiryDate'].invalid && f['expiryDate'].touched}">
                <div *ngIf="f['expiryDate'].invalid && f['expiryDate'].touched" class="invalid-feedback">
                  Expiry date must be in the future.
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2 pt-2 border-top mt-2">
                <button type="button" class="btn btn-light px-4 rounded-pill" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-danger px-4 rounded-pill" [disabled]="medicineForm.invalid">
                  {{ isEdit ? 'Update Medicine' : 'Save Medicine' }}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddEditMedicineModalComponent implements OnInit {
  @Input() medicine: Medicine | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Medicine>();

  medicineForm!: FormGroup;
  isEdit = false;
  today = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.isEdit = !!this.medicine;
    this.initForm();
  }

  initForm() {
    const formattedDate = this.medicine?.expiryDate ? new Date(this.medicine.expiryDate).toISOString().split('T')[0] : '';
    
    this.medicineForm = this.fb.group({
      id: [this.medicine?.id],
      name: [this.medicine?.name || '', Validators.required],
      stock: [this.medicine?.stock ?? '', [Validators.required, Validators.min(0)]],
      price: [this.medicine?.price ?? '', [Validators.required, Validators.min(0.01)]],
      expiryDate: [formattedDate, Validators.required]
    });
  }

  get f() { return this.medicineForm.controls; }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.medicineForm.valid) {
      // Basic future date validation
      const expDate = new Date(this.medicineForm.value.expiryDate);
      if (expDate <= new Date()) {
        this.medicineForm.controls['expiryDate'].setErrors({ 'invalidDate': true });
        return;
      }

      this.save.emit(this.medicineForm.value);
    } else {
      Object.keys(this.medicineForm.controls).forEach(key => {
        this.medicineForm.controls[key].markAsTouched();
      });
    }
  }
}
