import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistService {
  baseUrl = 'https://localhost:7163/api/Reception';

  constructor(private http: HttpClient) {}

  getAllPatients() {
    return this.http.get(this.baseUrl + '/patients');
  }

  getPatientById(id: number) {
    return this.http.get(this.baseUrl + '/patients/' + id);
  }

  searchPatients(term: string) {
    return this.http.get(this.baseUrl + '/patients/search?term=' + encodeURIComponent(term));
  }

  getNextMmrNo() {
    return this.http.get(this.baseUrl + '/patients/next-mmrno');
  }

  addPatient(data: any) {
    return this.http.post(this.baseUrl + '/patients', data);
  }

  updatePatient(id: number, data: any) {
    return this.http.put(this.baseUrl + '/patients/' + id, data);
  }

  deletePatient(id: number) {
    return this.http.delete(this.baseUrl + '/patients/' + id);
  }

  getSlotsByDate(date: string) {
    return this.http.get(this.baseUrl + '/slots?date=' + date);
  }

  bookAppointment(data: any) {
    return this.http.post(this.baseUrl + '/appointments', data);
  }

  getAppointmentsByPatient(patientId: number) {
    return this.http.get(this.baseUrl + '/appointments/patient/' + patientId);
  }

  getAllAppointments() {
    return this.http.get(this.baseUrl + '/appointments');
  }

  searchAppointments(term?: string, date?: string) {
    const params: string[] = [];

    if (term && term.trim()) {
      params.push('term=' + encodeURIComponent(term.trim()));
    }

    if (date && date.trim()) {
      params.push('date=' + date.trim());
    }

    const query = params.length > 0 ? '?' + params.join('&') : '';
    return this.http.get(this.baseUrl + '/appointments/search' + query);
  }

  getConsultationBill(appointmentId: number) {
    return this.http.get(this.baseUrl + '/billing/' + appointmentId);
  }

  downloadBillPdf(appointmentId: number) {
    return this.http.get(this.baseUrl + '/billing/' + appointmentId + '/pdf', {
      responseType: 'blob'
    });
  }

  emailBill(appointmentId: number, email: string) {
    return this.http.post(this.baseUrl + '/billing/' + appointmentId + '/email', {
      email: email
    });
  }
}