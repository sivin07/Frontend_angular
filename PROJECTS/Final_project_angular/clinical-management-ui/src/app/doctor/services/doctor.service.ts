import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponseDto,
  AppointmentDto,
  ConsultationDetailDto,
  SaveConsultationRequestDto,
  SaveConsultationResponseDto,
  MedicineDropdownDto,
  LabTestDropdownDto,
  PatientHistoryDto,
  LabResultDto
} from '../models/doctor.models';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly baseUrl = `${environment.apiUrl}/Doctor`;

  constructor(private http: HttpClient) {}

  getDashboardAppointments(): Observable<ApiResponseDto<AppointmentDto[]>> {
    return this.http.get<ApiResponseDto<AppointmentDto[]>>(`${this.baseUrl}/dashboard/appointments`);
  }

  getConsultationDetail(appointmentId: number): Observable<ApiResponseDto<ConsultationDetailDto>> {
    return this.http.get<ApiResponseDto<ConsultationDetailDto>>(`${this.baseUrl}/consultation/${appointmentId}`);
  }

  saveConsultation(request: SaveConsultationRequestDto): Observable<ApiResponseDto<SaveConsultationResponseDto>> {
    return this.http.post<ApiResponseDto<SaveConsultationResponseDto>>(`${this.baseUrl}/consultation/save`, request);
  }

  getMedicines(): Observable<ApiResponseDto<MedicineDropdownDto[]>> {
    return this.http.get<ApiResponseDto<MedicineDropdownDto[]>>(`${this.baseUrl}/medicines`);
  }

  getLabTests(): Observable<ApiResponseDto<LabTestDropdownDto[]>> {
    return this.http.get<ApiResponseDto<LabTestDropdownDto[]>>(`${this.baseUrl}/labtests`);
  }

  getPatientHistory(patientId: number): Observable<ApiResponseDto<PatientHistoryDto[]>> {
    return this.http.get<ApiResponseDto<PatientHistoryDto[]>>(`${this.baseUrl}/patient/${patientId}/history`);
  }

  getLabResults(date?: string): Observable<ApiResponseDto<LabResultDto[]>> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<ApiResponseDto<LabResultDto[]>>(`${this.baseUrl}/labresults`, { params });
  }

  getLabResultDetail(labRequestId: number): Observable<ApiResponseDto<LabResultDto>> {
    return this.http.get<ApiResponseDto<LabResultDto>>(`${this.baseUrl}/labresults/${labRequestId}`);
  }
}
