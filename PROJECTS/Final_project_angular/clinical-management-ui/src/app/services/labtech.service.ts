import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pendingtest } from '../models/pendingtest';
import { Labresult } from '../models/labresult';
import { Compledresult } from '../models/compledresult';

@Injectable({
  providedIn: 'root',
})
export class LabtechService {

  private baseUrl = environment.apiUrl + '/LabTechnician/';

  constructor(private http: HttpClient) { }

  // 1. Get Pending Tests
  getPendingTests(): Observable<Pendingtest[]> {
    return this.http.get<Pendingtest[]>(this.baseUrl + 'pending');
  }

  // 2. Complete Lab Test
  completeLabTest(id: number, data: any) {
    return this.http.post(
      this.baseUrl + 'complete/' + id,   // 🔥 use baseUrl (consistent)
      data,
      { responseType: 'text' }
    );
  }

  // 3. Get All Reports
  getLabReports(): Observable<Compledresult[]> {
    return this.http.get<Compledresult[]>(this.baseUrl + 'reports');
  }

  // 4. Get Reports By Patient
  getReportsByPatient(patientId: number): Observable<Compledresult[]> {
    return this.http.get<Compledresult[]>(this.baseUrl + 'reports/' + patientId);
  }
}
