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
  patientId: number = 0;
  editMode: boolean = false;
  searchTerm: string = '';

  slots: any[] = [];
  selectedDate: string = '';
  selectedSlotId: number = 0;
  bookedAppointments: any[] = [];
  billData: any = null;
  billAppointmentId: number = 0;

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

  loadPatients() {
    this.service.getAllPatients().subscribe({
      next: (data: any) => {
        this.patients = data;
      },
      error: (err: any) => {
        console.error('Load patients error:', err);
      }
    });
  }

  loadNextMmrNo() {
    this.service.getNextMmrNo().subscribe({
      next: (res: any) => {
        this.patientForm.mmrNo = res.mmrNo;
      },
      error: (err: any) => {
        console.error('MMR load error:', err);
      }
    });
  }

  searchPatients() {
    if (!this.searchTerm.trim()) {
      this.loadPatients();
      return;
    }

    this.service.searchPatients(this.searchTerm).subscribe({
      next: (data: any) => {
        this.patients = data;
      },
      error: (err: any) => {
        console.error('Search error:', err);
      }
    });
  }

  getPatientById() {
    if (!this.patientId) {
      alert('Enter Patient ID');
      return;
    }

    this.service.getPatientById(this.patientId).subscribe({
      next: (data: any) => {
        this.selectedPatient = data;
      },
      error: (err: any) => {
        console.error('Get by id error:', err);
      }
    });
  }

  isValidName(name: string): boolean {
    return /^[A-Za-z ]+$/.test((name || '').trim());
  }

  isValidAge(dob: string): boolean {
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

  isValidPhone(phone: string): boolean {
    if (!phone) return false;
    if (!/^[6-9][0-9]{9}$/.test(phone)) return false;
    if (/^(\d)\1{9}$/.test(phone)) return false;
    if (phone === '0000000000') return false;
    return true;
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());
  }

  isValidBloodGroup(bloodGroup: string): boolean {
    if (!bloodGroup) return true;
    return /^(A|B|AB|O)[+-]$/.test(bloodGroup.trim());
  }

  isPatientFormValid(): boolean {
    return (
      this.isValidName(this.patientForm.name) &&
      this.isValidAge(this.patientForm.dob) &&
      this.isValidPhone(this.patientForm.phone) &&
      this.isValidEmail(this.patientForm.email) &&
      this.isValidBloodGroup(this.patientForm.bloodGroup) &&
      !!this.patientForm.gender &&
      !!this.patientForm.address &&
      !!this.patientForm.status
    );
  }

  addPatient() {
    if (!this.isPatientFormValid()) {
      alert('Please correct the validation errors before adding patient.');
      return;
    }

    const payload = {
      patientId: 0,
      mmrno: this.patientForm.mmrNo,
      name: this.patientForm.name,
      gender: this.patientForm.gender,
      dob: this.patientForm.dob,
      phone: this.patientForm.phone,
      address: this.patientForm.address,
      bloodGroup: this.patientForm.bloodGroup,
      email: this.patientForm.email,
      status: this.patientForm.status
    };

    this.service.addPatient(payload).subscribe({
      next: (res: any) => {
        alert(res.message || 'Patient added successfully');
        this.loadPatients();
        this.resetForm();
        this.loadNextMmrNo();
      },
      error: (err: any) => {
        console.error('Add error:', err);
        alert(err.error?.message || 'Add failed');
      }
    });
  }

  editPatient(patient: any) {
    this.editMode = true;

    this.patientForm = {
      patientId: patient.patientId,
      mmrNo: patient.mmrno || '',
      name: patient.name || '',
      gender: patient.gender || '',
      dob: this.formatDateForInput(patient.dob),
      phone: patient.phone || '',
      address: patient.address || '',
      bloodGroup: patient.bloodGroup || '',
      email: patient.email || '',
      status: patient.status || 'Active'
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePatient() {
    if (!this.patientForm.patientId) {
      alert('Select a patient first to update');
      return;
    }

    if (!this.isPatientFormValid()) {
      alert('Please correct the validation errors before updating patient.');
      return;
    }

    const payload = {
      patientId: this.patientForm.patientId,
      mmrno: this.patientForm.mmrNo,
      name: this.patientForm.name,
      gender: this.patientForm.gender,
      dob: this.patientForm.dob,
      phone: this.patientForm.phone,
      address: this.patientForm.address,
      bloodGroup: this.patientForm.bloodGroup,
      email: this.patientForm.email,
      status: this.patientForm.status
    };

    this.service.updatePatient(this.patientForm.patientId, payload).subscribe({
      next: (res: any) => {
        alert(res.message || 'Patient updated successfully');
        this.loadPatients();
        this.resetForm();
        this.loadNextMmrNo();
      },
      error: (err: any) => {
        console.error('Update error:', err);
        alert(err.error?.message || 'Update failed');
      }
    });
  }

  deletePatient(id: number) {
    if (!confirm('Are you sure you want to mark this patient as inactive?')) return;

    this.service.deletePatient(id).subscribe({
      next: (res: any) => {
        alert(res.message || 'Patient marked as inactive successfully');
        this.loadPatients();
      },
      error: (err: any) => {
        console.error('Delete error:', err);
        alert(err.error?.message || 'Delete failed');
      }
    });
  }

  loadSlots() {
    if (!this.selectedDate) {
      alert('Select date first');
      return;
    }

    this.service.getSlotsByDate(this.selectedDate).subscribe({
      next: (data: any) => {
        this.slots = data;
      },
      error: (err: any) => {
        console.error('Slot load error:', err);
      }
    });
  }

  bookAppointment() {
    if (!this.patientId || !this.selectedSlotId) {
      alert('Select patient ID and slot');
      return;
    }

    this.service.bookAppointment({
      patientId: this.patientId,
      slotId: this.selectedSlotId
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Appointment booked successfully');
        this.loadAppointmentsByPatient();
      },
      error: (err: any) => {
        console.error('Booking error:', err);
        alert(err.error?.message || 'Booking failed');
      }
    });
  }

  loadAppointmentsByPatient() {
    if (!this.patientId) {
      alert('Enter patient ID first');
      return;
    }

    this.service.getAppointmentsByPatient(this.patientId).subscribe({
      next: (data: any) => {
        this.bookedAppointments = data;
      },
      error: (err: any) => {
        console.error('Appointment list error:', err);
      }
    });
  }

  loadBill() {
    if (!this.billAppointmentId) {
      alert('Enter appointment ID');
      return;
    }

    this.service.getConsultationBill(this.billAppointmentId).subscribe({
      next: (data: any) => {
        this.billData = data;
      },
      error: (err: any) => {
        console.error('Bill load error:', err);
      }
    });
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

  private formatDateForInput(dateValue: any): string {
    if (!dateValue) return '';
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  }
}