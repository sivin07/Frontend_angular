import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { Appointment } from '../models/appointment.model';
import { Slot } from '../models/slot.model';
import { Bill } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistService {
  private baseUrl = 'https://localhost:7163/api/Reception';

  constructor(private http: HttpClient) {}

  // ---------------- PATIENT MAPPERS ----------------
  private mapPatient(item: any): Patient {
    return {
      patientId: item?.patientId ?? item?.PatientId ?? 0,
      mmrno: item?.mmrno ?? item?.Mmrno ?? '',
      name: item?.name ?? item?.Name ?? '',
      gender: item?.gender ?? item?.Gender ?? '',
      dob: item?.dob ?? item?.Dob ?? '',
      phone: item?.phone ?? item?.Phone ?? '',
      address: item?.address ?? item?.Address ?? '',
      bloodGroup: item?.bloodGroup ?? item?.BloodGroup ?? '',
      email: item?.email ?? item?.Email ?? '',
      status: item?.status ?? item?.Status ?? 'Active'
    };
  }

  private mapAppointment(item: any): Appointment {
    return {
      appointmentId: item?.appointmentId ?? item?.AppointmentId ?? 0,
      patientId: item?.patientId ?? item?.PatientId ?? 0,
      patientName: item?.patientName ?? item?.PatientName ?? '',
      mmrNo: item?.mmrNo ?? item?.MmrNo ?? '',
      doctorId: item?.doctorId ?? item?.DoctorId ?? 0,
      slotId: item?.slotId ?? item?.SlotId ?? 0,
      tokenNumber: item?.tokenNumber ?? item?.TokenNumber ?? 0,
      appointmentDate: item?.appointmentDate ?? item?.AppointmentDate ?? '',
      status: item?.status ?? item?.Status ?? '',
      consultationBill: item?.consultationBill ?? item?.ConsultationBill ?? 0
    };
  }

  private mapSlot(item: any): Slot {
    return {
      slotId: item?.slotId ?? item?.SlotId ?? 0,
      doctorId: item?.doctorId ?? item?.DoctorId ?? 0,
      startTime: item?.startTime ?? item?.StartTime ?? '',
      endTime: item?.endTime ?? item?.EndTime ?? '',
      isAvailable: item?.isAvailable ?? item?.IsAvailable ?? true
    };
  }

  private mapBill(item: any): Bill {
    return {
      appointmentId: item?.appointmentId ?? item?.AppointmentId ?? 0,
      patientId: item?.patientId ?? item?.PatientId ?? 0,
      patientName: item?.patientName ?? item?.PatientName ?? '',
      mmrNo: item?.mmrNo ?? item?.MmrNo ?? '',
      patientEmail: item?.patientEmail ?? item?.PatientEmail ?? '',
      doctorId: item?.doctorId ?? item?.DoctorId ?? 0,
      tokenNumber: item?.tokenNumber ?? item?.TokenNumber ?? 0,
      appointmentDate: item?.appointmentDate ?? item?.AppointmentDate ?? '',
      status: item?.status ?? item?.Status ?? '',
      doctorFee: item?.doctorFee ?? item?.DoctorFee ?? 0
    };
  }

  // ---------------- PATIENTS ----------------
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patients`).pipe(
      map((data) => (data || []).map((x) => this.mapPatient(x)))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.baseUrl}/patients/${id}`).pipe(
      map((data) => this.mapPatient(data))
    );
  }

  searchPatients(term: string): Observable<Patient[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patients/search?term=${encodeURIComponent(term)}`).pipe(
      map((data) => (data || []).map((x) => this.mapPatient(x)))
    );
  }

  getNextMmrNo(): Observable<{ mmrNo: string }> {
    return this.http.get<any>(`${this.baseUrl}/patients/next-mmrno`).pipe(
      map((res) => ({
        mmrNo: res?.mmrNo ?? res?.MmrNo ?? ''
      }))
    );
  }

  addPatient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/patients`, data, {
      responseType: 'text'
    }).pipe(
      map((res) => ({ message: res || 'Patient added successfully' }))
    );
  }

  updatePatient(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/patients/${id}`, data, {
      responseType: 'text'
    }).pipe(
      map((res) => ({ message: res || 'Patient updated successfully' }))
    );
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/patients/${id}`, {
      responseType: 'text'
    }).pipe(
      map((res) => ({ message: res || 'Patient marked inactive successfully' }))
    );
  }

  // ---------------- SLOTS ----------------
  getSlotsByDate(date: string): Observable<Slot[]> {
    return this.http.get<any[]>(`${this.baseUrl}/slots?date=${date}`).pipe(
      map((data) => (data || []).map((x) => this.mapSlot(x)))
    );
  }

  // ---------------- APPOINTMENTS ----------------
  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments`, data, {
      responseType: 'text'
    }).pipe(
      map((res) => ({ message: res || 'Appointment booked successfully' }))
    );
  }

  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<any[]>(`${this.baseUrl}/appointments/patient/${patientId}`).pipe(
      map((data) => (data || []).map((x) => this.mapAppointment(x)))
    );
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<any[]>(`${this.baseUrl}/appointments`).pipe(
      map((data) => (data || []).map((x) => this.mapAppointment(x)))
    );
  }

  searchAppointments(term?: string, date?: string): Observable<Appointment[]> {
    const params: string[] = [];

    if (term?.trim()) {
      params.push(`term=${encodeURIComponent(term.trim())}`);
    }

    if (date?.trim()) {
      params.push(`date=${date.trim()}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';

    return this.http.get<any[]>(`${this.baseUrl}/appointments/search${query}`).pipe(
      map((data) => (data || []).map((x) => this.mapAppointment(x)))
    );
  }

  // ---------------- BILLING ----------------
  getConsultationBill(appointmentId: number): Observable<Bill> {
    return this.http.get<any>(`${this.baseUrl}/billing/${appointmentId}`).pipe(
      map((data) => this.mapBill(data))
    );
  }

  downloadBillPdf(appointmentId: number) {
    return this.http.get(`${this.baseUrl}/billing/${appointmentId}/pdf`, {
      responseType: 'blob'
    });
  }

  emailBill(appointmentId: number, email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/billing/${appointmentId}/email`, { email }, {
      responseType: 'text'
    }).pipe(
      map((res) => ({ message: res || 'Bill emailed successfully' }))
    );
  }
}