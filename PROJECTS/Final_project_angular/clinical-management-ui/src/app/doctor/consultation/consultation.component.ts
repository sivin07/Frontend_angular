import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { 
  ConsultationDetailDto, 
  MedicineDropdownDto, 
  LabTestDropdownDto, 
  PatientHistoryDto, 
  SaveConsultationRequestDto 
} from '../models/doctor.models';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit {
  appointmentId!: number;
  consultationDetails?: ConsultationDetailDto;
  patientHistory: PatientHistoryDto[] = [];
  
  availableMedicines: MedicineDropdownDto[] = [];
  availableLabTests: LabTestDropdownDto[] = [];

  consultationForm!: FormGroup;

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  stockErrors: string[] = [];
  activeTab = 'consultation'; // 'consultation' or 'history'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.appointmentId) {
      this.errorMessage = 'Invalid Appointment ID';
      return;
    }

    this.initForm();
    this.loadInitialData();
  }

  initForm(): void {
    this.consultationForm = this.fb.group({
      symptoms: ['', Validators.required],
      diagnosis: ['', Validators.required],
      doctorNotes: [''],
      medicines: this.fb.array([]),
      labTests: this.fb.array([])
    });
  }

  // --- Form Array Getters ---
  get medicines(): FormArray {
    return this.consultationForm.get('medicines') as FormArray;
  }

  get labTests(): FormArray {
    return this.consultationForm.get('labTests') as FormArray;
  }

  addMedicine(): void {
    const medGroup = this.fb.group({
      medicineId: ['', Validators.required],
      frequency: [1, [Validators.required, Validators.min(1)]],
      duration: [1, [Validators.required, Validators.min(1)]]
    });
    this.medicines.push(medGroup);
  }

  removeMedicine(index: number): void {
    this.medicines.removeAt(index);
  }

  addLabTest(): void {
    const labGroup = this.fb.group({
      labTestId: ['', Validators.required],
      specialInstructions: ['']
    });
    this.labTests.push(labGroup);
  }

  removeLabTest(index: number): void {
    this.labTests.removeAt(index);
  }

  // --- Data Loading ---
  loadInitialData(): void {
    this.isLoading = true;
    
    // First get consultation detail to get the patient Id
    this.doctorService.getConsultationDetail(this.appointmentId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.consultationDetails = res.data;
          
          if (this.consultationDetails.symptoms) {
               this.consultationForm.patchValue({
                 symptoms: this.consultationDetails.symptoms,
                 diagnosis: this.consultationDetails.diagnosis,
                 doctorNotes: this.consultationDetails.doctorNotes
               });
          }

          // Load other related resources parallel after getting patient info
          this.loadDropdowns();
          this.loadPatientHistory(res.data.patientId);
        } else {
          this.errorMessage = res.message || 'Error loading details.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error fetching consultation specifics.';
        this.isLoading = false;
      }
    });
  }

  loadDropdowns(): void {
    this.doctorService.getMedicines().subscribe(res => {
      if (res.success && res.data) this.availableMedicines = res.data;
    });
    this.doctorService.getLabTests().subscribe(res => {
      if (res.success && res.data) this.availableLabTests = res.data;
    });
  }

  loadPatientHistory(patientId: number): void {
    this.doctorService.getPatientHistory(patientId).subscribe(res => {
      if (res.success && res.data) this.patientHistory = res.data;
    });
  }

  // --- UI Helpers ---
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  // Stock Validation per Medicine Row
  getMedicineStockError(index: number): string | null {
    const row = this.medicines.at(index);
    const medId = Number(row.get('medicineId')?.value);
    const freq = Number(row.get('frequency')?.value) || 0;
    const dur = Number(row.get('duration')?.value) || 0;
    
    if (!medId || freq <= 0 || dur <= 0) return null;

    const med = this.availableMedicines.find(m => m.medicineId === medId);
    if (!med) return null;

    const requiredQty = freq * dur;
    if (requiredQty > med.availableStock) {
      return `Not enough medicine! Req: ${requiredQty}, Stock: ${med.availableStock}`;
    }
    return null;
  }

  get isFormInvalid(): boolean {
    if (this.consultationForm.invalid) return true;
    
    // Check stock for all rows
    for (let i = 0; i < this.medicines.length; i++) {
        if (this.getMedicineStockError(i) !== null) {
            return true;
        }
    }
    return false;
  }

  // --- Save / Submission ---
  saveConsultation(): void {
    if (this.isFormInvalid || !this.consultationDetails) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.stockErrors = [];

    const rawForm = this.consultationForm.value;
    
    // Auto-calculate medicine name for DTO even if backend usually does it, 
    // to strictly match the DTO expectations.
    const preparedMedicines = rawForm.medicines.map((m: any) => {
       const matchedMed = this.availableMedicines.find(am => am.medicineId === Number(m.medicineId));
       return {
         ...m,
         medicineId: Number(m.medicineId),
         medicineName: matchedMed?.medicineName || 'Unknown'
       };
    });

    const preparedLabTests = rawForm.labTests.map((l: any) => ({
        ...l, 
        labTestId: Number(l.labTestId)
    }));

    const payload: SaveConsultationRequestDto = {
      appointmentId: this.appointmentId,
      patientId: this.consultationDetails.patientId,
      doctorId: 0, // Backend will extract from token, but need to pass field if typescript complains
      symptoms: rawForm.symptoms,
      diagnosis: rawForm.diagnosis,
      doctorNotes: rawForm.doctorNotes,
      medicines: preparedMedicines,
      labTests: preparedLabTests
    };

    this.doctorService.saveConsultation(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
           this.successMessage = 'Consultation details saved successfully!';
           // Optionally route back
           setTimeout(() => this.router.navigate(['/doctor/dashboard']), 1500);
        } else {
           this.errorMessage = res.message;
           // If backend returns specific stock failures, catch them here
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to save consultation.';
        if (err.error?.stockErrors) {
            this.stockErrors = err.error.stockErrors;
        }
        console.error(err);
      }
    });
  }
}
