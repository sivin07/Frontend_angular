import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionSummary, PrescriptionDetail } from '../../models/pharmacist.model';

@Component({
  selector: 'app-prescription-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">
              Appointment #{{ prescription.appointmentId }}
            </h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6 border-end">
                <p class="mb-1 text-muted small">Patient Name</p>
                <h6 class="fw-bold">{{ prescription.patientName }}</h6>
              </div>
              <div class="col-md-6 ps-md-4">
                <p class="mb-1 text-muted small">Doctor</p>
                <h6 class="fw-bold">Dr. {{ prescription.doctorName }}</h6>
                <p class="mb-0 text-muted small mt-2">
                  Date: {{ prescription.prescribedDate | date }}
                </p>
              </div>
            </div>
            <h6 class="fw-bold border-bottom pb-2 mb-3">Prescribed Medicines</h6>
            <div class="table-responsive">
              <table class="table table-bordered table-sm">
                <thead class="table-light">
                  <tr>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Dosage</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let med of medicines">
                    <td class="fw-semibold">{{ med.medicineName }}</td>
                    <td>{{ med.quantity }}</td>
                    <td>{{ med.dosage }}</td>
                    <td>
                      <span [class]="med.medicineStock > 0 ? 'text-success' : 'text-danger'">
                        {{ med.medicineStock > 0 ? med.medicineStock + ' units' : 'Out of Stock' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-warning rounded-pill"
                        [disabled]="med.medicineStock <= 0 || med.status === 'Issued'"
                        (click)="onIssue(med.prescriptionId)">
                        {{ med.status === 'Issued' ? 'Issued ✓' : 'Issue' }}
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="!medicines || medicines.length === 0">
                    <td colspan="5" class="text-center text-muted">No medicines found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-light" (click)="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PrescriptionDetailModalComponent {
    @Input() prescription!: PrescriptionSummary;
    @Input() medicines: PrescriptionDetail[] = [];
    @Output() close = new EventEmitter<void>();
    @Output() issue = new EventEmitter<number>();

    closeModal() {
        this.close.emit();
    }

    onIssue(prescriptionId: number) {
        this.issue.emit(prescriptionId);
    }
}