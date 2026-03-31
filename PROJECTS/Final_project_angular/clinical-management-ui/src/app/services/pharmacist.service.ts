import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bill, Medicine, PrescriptionSummary, PrescriptionDetail } from '../models/pharmacist.model';
@Injectable({
  providedIn: 'root'
})
export class PharmacistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


getPendingPrescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pharmacist/prescriptions/pending`);
}

getIssuedPrescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pharmacist/prescriptions/issued`);
}

getPrescriptions(status: string): Observable<any[]> {
    let params = new HttpParams().set('status', status);
    return this.http.get<any[]>(`${this.apiUrl}/pharmacist/prescriptions/search`, { params });
}

getPrescriptionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pharmacist/prescriptions/${id}`);
}

getPrescriptionsByAppointment(appointmentId: number): Observable<any[]> {
    return this.http.get<any[]>(
        `${this.apiUrl}/pharmacist/prescriptions/details/${appointmentId}`
    );
}


  issuePrescription(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pharmacist/prescriptions/issue/${id}`, {});
  }

  // Bills
  getBills(search?: string): Observable<Bill[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Bill[]>(`${this.apiUrl}/pharmacist/bills`, { params });
  }


  getBillByAppointment(appointmentId: number): Observable<any> {
    return this.http.get<any>(
        `${this.apiUrl}/pharmacist/bill/appointment/${appointmentId}`
    );
}

  getBillById(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/pharmacist/bills/${id}`);
  }

  // Medicines
  getMedicines(search?: string): Observable<Medicine[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Medicine[]>(`${this.apiUrl}/pharmacist/medicines`, { params });
  }

  getLowStockMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/pharmacist/medicines/low-stock`);
  }

  addMedicine(data: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.apiUrl}/pharmacist/medicines`, data);
  }

  updateMedicine(id: number, data: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiUrl}/pharmacist/medicines/${id}`, data);
  }

  deleteMedicine(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pharmacist/medicines/${id}`);
  }
}
