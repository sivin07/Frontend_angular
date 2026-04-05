import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReceptionistService } from '../../services/receptionist';

@Component({
  selector: 'app-patient-management',
  standalone: true,
imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-management.html',
  styleUrl: './patient-management.css'
})
export class PatientManagement implements OnInit {
  patients: any[] = [];
  selectedPatient: any = null;

  searchTerm: string = '';
  patientId: number = 0;
  selectedDate: string = '';
  slots: any[] = [];
  selectedSlotId: number = 0;
  bookedAppointments: any[] = [];
  billAppointmentId: number = 0;
  billData: any = null;

  successMessage: string = '';
  errorMessage: string = '';

  editMode: boolean = false;

  patientForm: any = {
    patientId: 0,
    mmrNo: '',
    name: '',
    gender: '',
    dob: '',
    phone: '',
    address: '',
    bloodGroup: '',
    email: '',
    status: 'Active'
  };

  constructor(private service: ReceptionistService) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadNextMmrNo();
  }

  // -------- helpers to handle PascalCase or camelCase from backend --------
  private mapPatient(p: any): any {
    return {
      patientId: p.patientId ?? p.PatientId ?? 0,
      mmrno: p.mmrno ?? p.Mmrno ?? '',
      name: p.name ?? p.Name ?? '',
      gender: p.gender ?? p.Gender ?? '',
      dob: p.dob ?? p.Dob ?? '',
      phone: p.phone ?? p.Phone ?? '',
      address: p.address ?? p.Address ?? '',
      bloodGroup: p.bloodGroup ?? p.BloodGroup ?? '',
      email: p.email ?? p.Email ?? '',
      status: p.status ?? p.Status ?? ''
    };
  }

  private mapSlot(s: any): any {
    return {
      slotId: s.slotId ?? s.SlotId ?? 0,
      doctorId: s.doctorId ?? s.DoctorId ?? 0,
      startTime: s.startTime ?? s.StartTime ?? '',
      endTime: s.endTime ?? s.EndTime ?? ''
    };
  }

  private mapAppointment(a: any): any {
    return {
      appointmentId: a.appointmentId ?? a.AppointmentId ?? 0,
      patientId: a.patientId ?? a.PatientId ?? 0,
      doctorId: a.doctorId ?? a.DoctorId ?? 0,
      slotId: a.slotId ?? a.SlotId ?? 0,
      tokenNumber: a.tokenNumber ?? a.TokenNumber ?? 0,
      appointmentDate: a.appointmentDate ?? a.AppointmentDate ?? '',
      status: a.status ?? a.Status ?? '',
      consultationBill: a.consultationBill ?? a.ConsultationBill ?? 0
    };
  }

  private mapBill(b: any): any {
    return {
      appointmentId: b.appointmentId ?? b.AppointmentId ?? 0,
      patientId: b.patientId ?? b.PatientId ?? 0,
      patientName: b.patientName ?? b.PatientName ?? '',
      mmrNo: b.mmrNo ?? b.MmrNo ?? '',
      patientEmail: b.patientEmail ?? b.PatientEmail ?? '',
      doctorId: b.doctorId ?? b.DoctorId ?? 0,
      doctorFee: b.doctorFee ?? b.DoctorFee ?? 0,
      tokenNumber: b.tokenNumber ?? b.TokenNumber ?? 0,
      appointmentDate: b.appointmentDate ?? b.AppointmentDate ?? '',
      status: b.status ?? b.Status ?? ''
    };
  }

  loadPatients() {
    this.service.getAllPatients().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : [];
        this.patients = list.map((p: any) => this.mapPatient(p));
        console.log('PATIENT DATA:', this.patients);
      },
      error: () => this.showError('Failed to load patients')
    });
  }

  loadNextMmrNo() {
    this.service.getNextMmrNo().subscribe({
      next: (res: any) => {
        this.patientForm.mmrNo = res?.mmrNo ?? res?.MmrNo ?? '';
      },
      error: () => this.showError('Failed to load next MMR number')
    });
  }

  searchPatients() {
    if (!this.searchTerm.trim()) {
      this.loadPatients();
      return;
    }

    this.service.searchPatients(this.searchTerm).subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : [];
        this.patients = list.map((p: any) => this.mapPatient(p));
      },
      error: () => this.showError('Search failed')
    });
  }

  getPatientById() {
    if (!this.patientId) {
      this.showError('Enter patient ID');
      return;
    }

    this.service.getPatientById(this.patientId).subscribe({
      next: (data: any) => {
        this.selectedPatient = this.mapPatient(data);
      },
      error: () => {
        this.selectedPatient = null;
        this.showError('Patient not found');
      }
    });
  }

  addPatient() {
    if (!this.isPatientFormValid()) {
      this.showError('Please enter valid patient details');
      return;
    }

    const payload = {
      patientId: 0,
      mmrno: this.patientForm.mmrNo,
      name: this.patientForm.name?.trim(),
      gender: this.patientForm.gender,
      dob: this.patientForm.dob,
      phone: this.patientForm.phone,
      address: this.patientForm.address?.trim(),
      bloodGroup: this.patientForm.bloodGroup?.trim(),
      email: this.patientForm.email?.trim(),
      status: this.patientForm.status
    };

    this.service.addPatient(payload).subscribe({
      next: (res: any) => {
        this.showSuccess(res?.message ?? 'Patient added successfully');
        this.loadPatients();
        this.resetForm();
        this.loadNextMmrNo();
      },
      error: () => this.showError('Add failed')
    });
  }

  editPatient(p: any) {
    this.editMode = true;

    this.patientForm = {
      patientId: p.patientId,
      mmrNo: p.mmrno,
      name: p.name,
      gender: p.gender,
      dob: this.formatDate(p.dob),
      phone: p.phone,
      address: p.address,
      bloodGroup: p.bloodGroup,
      email: p.email,
      status: p.status
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePatient() {
    if (!this.patientForm.patientId) {
      this.showError('Select a patient first');
      return;
    }

    if (!this.isPatientFormValid()) {
      this.showError('Please enter valid patient details');
      return;
    }

    const payload = {
      patientId: this.patientForm.patientId,
      mmrno: this.patientForm.mmrNo,
      name: this.patientForm.name?.trim(),
      gender: this.patientForm.gender,
      dob: this.patientForm.dob,
      phone: this.patientForm.phone,
      address: this.patientForm.address?.trim(),
      bloodGroup: this.patientForm.bloodGroup?.trim(),
      email: this.patientForm.email?.trim(),
      status: this.patientForm.status
    };

    this.service.updatePatient(this.patientForm.patientId, payload).subscribe({
      next: (res: any) => {
        this.showSuccess(res?.message ?? 'Updated successfully');
        this.loadPatients();
        this.resetForm();
        this.loadNextMmrNo();
      },
      error: () => this.showError('Update failed')
    });
  }

  deletePatient(id: number) {
    if (!confirm('Are you sure you want to mark this patient as inactive?')) {
      return;
    }

    this.service.deletePatient(id).subscribe({
      next: (res: any) => {
        this.showSuccess(res?.message ?? 'Patient marked inactive');
        this.loadPatients();
      },
      error: () => this.showError('Delete failed')
    });
  }

  loadSlots() {
    if (!this.selectedDate) {
      this.showError('Select a date first');
      return;
    }

    this.service.getSlotsByDate(this.selectedDate).subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : [];
        this.slots = list.map((s: any) => this.mapSlot(s));
      },
      error: () => this.showError('Failed to load slots')
    });
  }

  bookAppointment() {
    if (!this.patientId || !this.selectedSlotId) {
      this.showError('Enter patient ID and select slot');
      return;
    }

    this.service.bookAppointment({
      patientId: this.patientId,
      slotId: this.selectedSlotId
    }).subscribe({
      next: (res: any) => {
        this.showSuccess(res?.message ?? 'Appointment booked');
        this.loadAppointmentsByPatient();
      },
      error: () => this.showError('Booking failed')
    });
  }

  loadAppointmentsByPatient() {
    if (!this.patientId) {
      this.showError('Enter patient ID first');
      return;
    }

    this.service.getAppointmentsByPatient(this.patientId).subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : [];
        this.bookedAppointments = list.map((a: any) => this.mapAppointment(a));
      },
      error: () => this.showError('Failed to load appointments')
    });
  }

  loadBill() {
    if (!this.billAppointmentId) {
      this.showError('Enter appointment ID');
      return;
    }

    this.service.getConsultationBill(this.billAppointmentId).subscribe({
      next: (data: any) => {
        this.billData = this.mapBill(data);
      },
      error: () => this.showError('Failed to load bill')
    });
  }

  isValidName(name: string) {
    return /^[A-Za-z ]+$/.test((name || '').trim());
  }

  isValidAge(dob: string) {
    if (!dob) return false;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 1 && age <= 120;
  }

  isValidPhone(phone: string) {
    const value = (phone || '').trim();
    return /^[6-9][0-9]{9}$/.test(value) && !/^(\d)\1{9}$/.test(value);
  }

  isValidBloodGroup(bg: string) {
    const value = (bg || '').trim();
    return /^(A|B|AB|O)[+-]$/.test(value);
  }

  isValidEmail(email: string) {
    const value = (email || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  isPatientFormValid() {
    return this.isValidName(this.patientForm.name) &&
      this.isValidAge(this.patientForm.dob) &&
      this.isValidPhone(this.patientForm.phone) &&
      !!(this.patientForm.address || '').trim() &&
      this.isValidBloodGroup(this.patientForm.bloodGroup) &&
      this.isValidEmail(this.patientForm.email) &&
      !!this.patientForm.gender &&
      !!this.patientForm.status;
  }

  resetForm() {
    this.editMode = false;
    this.patientForm = {
      patientId: 0,
      mmrNo: '',
      name: '',
      gender: '',
      dob: '',
      phone: '',
      address: '',
      bloodGroup: '',
      email: '',
      status: 'Active'
    };
  }

  formatDate(date: any) {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }

  showSuccess(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(msg: string) {
    this.errorMessage = msg;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 3000);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);

    if (!/^[a-zA-Z ]+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  blockPasteNonNumeric(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';

    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault();
    }
  }

  blockPasteNonLetters(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';

    if (!/^[a-zA-Z ]+$/.test(pastedText)) {
      event.preventDefault();
    }
  }

  preventSpecialCharacters(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode || event.keyCode);
    const target = event.target as HTMLInputElement;
    
    // Allow letters, numbers, and spaces. Block special characters.
    if (!/^[a-zA-Z0-9 ]+$/.test(inputChar)) {
      event.preventDefault();
      return;
    }

    // Prevent leading spaces and consecutive spaces
    if (inputChar === ' ' && (!target.value || target.value.endsWith(' '))) {
      event.preventDefault();
    }
  }

  blockPasteSpecialCharacters(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';
    
    // Block if it's purely empty spaces or contains special chars
    if (!/^[a-zA-Z0-9 ]+$/.test(pastedText) || pastedText.trim().length === 0) {
      event.preventDefault();
    }
  }
}