import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionDetail, PrescriptionSummary } from '../../models/pharmacist.model';
import { PharmacistService } from '../../services/pharmacist.service';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm border-0 mb-4 rounded-4">
      <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
        <h4 class="fw-bold mb-1">Pending Prescriptions</h4>
        <p class="text-muted small mb-0">Review requests and issue medicines to patients.</p>
      </div>
      <div class="card-body px-4 py-4">
        <div class="row mb-4">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                class="form-control border-start-0 bg-light"
                [(ngModel)]="searchTerm"
                placeholder="Search by patient, doctor, or ID..."
              />
            </div>
          </div>
        </div>

        <div class="table-responsive rounded-3 border">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-3">Appointment ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
                <th class="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="isLoading">
                <td colspan="6" class="py-4 text-center">
                  <div class="spinner-border text-primary spinner-border-sm me-2"></div>
                  Loading...
                </td>
              </tr>
              <tr *ngIf="!isLoading && filteredPrescriptions.length === 0">
                <td colspan="6" class="py-4 text-center text-muted">
                  No pending prescriptions found.
                </td>
              </tr>
              <tr *ngFor="let p of filteredPrescriptions">
                <td class="ps-3 text-muted fw-medium">#{{ p.appointmentId }}</td>
                <td class="fw-bold">{{ p.patientName }}</td>
                <td>Dr. {{ p.doctorName }}</td>
                <td class="text-muted">{{ p.prescribedDate | date: 'shortDate' }}</td>
                <td>
                  <span class="badge bg-warning text-dark px-3 py-2 rounded-pill">Pending</span>
                </td>
                <td class="text-end pe-3">
                  <button
                    class="btn btn-sm btn-outline-primary rounded-pill px-3"
                    (click)="viewDetails(p.appointmentId)"
                  >
                    <i class="bi bi-eye"></i> View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div class="modal d-block bg-dark bg-opacity-50" *ngIf="selectedPrescriptions.length > 0">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              Medicines for Appointment #{{ selectedAppointmentId }}
            </h5>
            <button class="btn-close" (click)="closeDetails()"></button>
          </div>
          <div class="modal-body">
            <table class="table table-hover align-middle">
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
                <tr *ngFor="let m of selectedPrescriptions">
                  <td class="fw-bold">{{ m.medicineName }}</td>
                  <td>{{ m.quantity }}</td>
                  <td>{{ m.dosage }}</td>
                  <td>
                    <span
                      [class]="m.medicineStock > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'"
                    >
                      {{ m.medicineStock > 0 ? m.medicineStock + ' units' : 'Out of Stock' }}
                    </span>
                  </td>
                  <td>
                    <button
                      class="btn btn-sm btn-warning rounded-pill px-3"
                      [disabled]="m.medicineStock <= 0 || m.status === 'Issued'"
                      (click)="issueMedicine(m.prescriptionId)"
                    >
                      {{ m.status === 'Issued' ? 'Issued ✓' : 'Issue' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary rounded-pill px-4" (click)="closeDetails()">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: PrescriptionSummary[] = [];
  filteredPrescriptions: PrescriptionSummary[] = [];
  selectedPrescriptions: PrescriptionDetail[] = [];
  selectedAppointmentId: number | null = null;
  isLoading = false;

  _searchTerm = '';
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    this.filterData();
  }

  constructor(
    private pharmacistService: PharmacistService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.isLoading = true;
    this.pharmacistService.getPendingPrescriptions().subscribe({
      next: (res: any[]) => {
        const grouped = res.reduce((acc: any, p: any) => {
          if (!acc[p.AppointmentId]) {
            acc[p.AppointmentId] = {
              appointmentId: p.AppointmentId,
              patientName: p.Patient?.Name,
              doctorName: p.Doctor?.Staff?.Name,
              prescribedDate: p.PrescribedDate,
              status: p.Status,
            };
          }
          return acc;
        }, {});
        this.prescriptions = Object.values(grouped);
        this.filteredPrescriptions = [...this.prescriptions];
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error loading prescriptions');
        this.isLoading = false;
      },
    });
  }

  filterData() {
    if (!this.searchTerm) {
      this.filteredPrescriptions = [...this.prescriptions];
      return;
    }
    const lower = this.searchTerm.toLowerCase();
    this.filteredPrescriptions = this.prescriptions.filter(
      (p) =>
        p.patientName?.toLowerCase().includes(lower) ||
        p.doctorName?.toLowerCase().includes(lower) ||
        p.appointmentId?.toString().includes(lower),
    );
  }

viewDetails(appointmentId: number) {
    this.selectedAppointmentId = appointmentId;
    this.pharmacistService.getPrescriptionsByAppointment(appointmentId).subscribe({
        next: (res: any[]) => {
            this.selectedPrescriptions = res.map(p => ({
                prescriptionId: p.PrescriptionId,
                medicineName: p.MedicineName,      // ✅ flat
                medicineStock: p.Stock,             // ✅ flat
                quantity: p.Quantity,               // ✅ flat
                dosage: p.Dosage,                   // ✅ flat
                status: p.Status
            }));
        },
        error: () => this.toastr.error('Failed to load details')
    });
}
  closeDetails() {
    this.selectedPrescriptions = [];
    this.selectedAppointmentId = null;
  }

  issueMedicine(prescriptionId: number) {
    if (confirm('Issue this medicine?')) {
      this.pharmacistService.issuePrescription(prescriptionId).subscribe({
        next: () => {
          this.toastr.success('Medicine issued successfully!');
          this.closeDetails();
          this.loadPrescriptions();
        },
        error: () => this.toastr.error('Failed to issue medicine.'),
      });
    }
  }
}
