import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionSummary } from '../../models/pharmacist.model';
import { PharmacistService } from '../../services/pharmacist.service';
@Component({
  selector: 'app-prescription-completed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm border-0 mb-4 rounded-4">
      <div
        class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center"
      >
        <div>
          <h4 class="fw-bold mb-1">Completed Prescriptions</h4>
          <p class="text-muted small mb-0">
            History of issued medicines and resolved prescriptions.
          </p>
        </div>
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
                placeholder="Search history..."
              />
            </div>
          </div>
        </div>

        <div class="table-responsive rounded-3 border">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-3 border-bottom-0">ID</th>
                <th class="border-bottom-0">Patient Name</th>
                <th class="border-bottom-0">Doctor</th>
                <th class="border-bottom-0">Issue Date</th>
                <th class="border-bottom-0">Status</th>
                <th class="text-end pe-3 border-bottom-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="isLoading" class="text-center">
                <td colspan="6" class="py-4">
                  <div
                    class="spinner-border text-success spinner-border-sm me-2"
                    role="status"
                  ></div>
                  Loading history...
                </td>
              </tr>
              <tr *ngIf="!isLoading && filteredPrescriptions.length === 0" class="text-center">
                <td colspan="6" class="py-4 text-muted">No completed prescriptions found.</td>
              </tr>
              <tr *ngFor="let p of filteredPrescriptions">
                <td class="ps-3 text-muted fw-medium">#{{ p.appointmentId }}</td>
                <td class="fw-bold">{{ p.patientName }}</td>
                <td>Dr. {{ p.doctorName }}</td>
                <td class="text-muted">{{ p.prescribedDate | date: 'shortDate' }}</td>
                <td>
                  <span class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                    <i class="bi bi-check-circle me-1"></i>Completed
                  </span>
                </td>
                <td class="text-end pe-3">
                  <button
                    class="btn btn-sm btn-outline-secondary rounded-pill px-3 me-2"
                    (click)="viewBill(p.appointmentId)"
                  >
                    <i class="bi bi-receipt"></i> View Bill
                  </button>
                  <button
                    class="btn btn-sm btn-outline-dark rounded-pill px-3"
                    (click)="printBill(p.appointmentId)"
                  >
                    <i class="bi bi-printer"></i> Print
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

<!-- Bill Modal -->
<div class="modal d-block bg-dark bg-opacity-50" *ngIf="selectedBill">
    <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">
                    Bill - Appointment #{{selectedBill?.AppointmentId}}
                </h5>
                <button class="btn-close" (click)="closeBill()"></button>
            </div>
            <div class="modal-body">
                <h6 class="fw-bold mb-3">
                    Patient: {{selectedBill?.Bills?.[0]?.PatientName}}
                </h6>
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th>Medicine</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let b of selectedBill?.Bills">
                            <td>{{b.MedicineName}}</td>
                            <td>{{b.Quantity}}</td>
                            <td>₹{{b.Price}}</td>
                            <td>₹{{b.Bill}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-end fw-bold">Total:</td>
                            <td class="fw-bold text-success">
                                ₹{{selectedBill?.TotalBill}}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary rounded-pill px-4"
                    (click)="closeBill()">Close</button>
                <button class="btn btn-primary rounded-pill px-4"
                    (click)="printBill(selectedBill.AppointmentId)">
                    <i class="bi bi-printer"></i> Print
                </button>
            </div>
        </div>
    </div>
</div>
  `,
})
export class PrescriptionCompletedComponent implements OnInit {
  prescriptions: PrescriptionSummary[] = [];
  filteredPrescriptions: PrescriptionSummary[] = [];
  selectedBill: any = null;
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
    this.pharmacistService.getIssuedPrescriptions().subscribe({
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
        this.toastr.error('Error loading history');
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
  viewBill(appointmentId: number) {
    this.pharmacistService.getBillByAppointment(appointmentId).subscribe({
      next: (res: any) => {
        if (!res || !res.Bills || res.Bills.length === 0) {
          this.toastr.warning('No bill found for this appointment!');
          return;
        }
        this.selectedBill = res;
      },
      error: () => this.toastr.error('Failed to load bill'),
    });
  }

  closeBill() {
    this.selectedBill = null;
  }

printBill(appointmentId: number) {
    this.pharmacistService.getBillByAppointment(appointmentId).subscribe({
        next: (res: any) => {
            if (!res || !res.Bills || res.Bills.length === 0) {
                this.toastr.warning('No bill found!');
                return;
            }
            this.selectedBill = res;
            setTimeout(() => window.print(), 500);
        },
        error: () => this.toastr.error('Failed to load bill')
    });
}
}
