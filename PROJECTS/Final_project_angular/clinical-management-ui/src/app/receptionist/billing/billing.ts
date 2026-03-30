import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReceptionistService } from '../../services/receptionist';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class BillingComponent implements OnInit {
  appointmentId: number = 0;
  billData: any = null;
  emailToSend: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: ReceptionistService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['appointmentId']) {
        this.appointmentId = +params['appointmentId'];
        this.loadBill();
      }
    });
  }

  loadBill() {
    if (!this.appointmentId) {
      alert('Select an appointment first');
      return;
    }

    this.service.getConsultationBill(this.appointmentId).subscribe({
      next: (data: any) => {
        this.billData = data;
        this.emailToSend = data.patientEmail || '';
      },
      error: (err: any) => {
        console.error('Bill load error:', err);
      }
    });
  }

  downloadPdf() {
    if (!this.appointmentId) return;

    this.service.downloadBillPdf(this.appointmentId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ConsultationBill_${this.appointmentId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('PDF download error:', err);
      }
    });
  }

  sendEmail() {
    if (!this.appointmentId) return;

    this.service.emailBill(this.appointmentId, this.emailToSend).subscribe({
      next: (res: any) => {
        alert(res.message || 'Bill emailed successfully');
      },
      error: (err: any) => {
        console.error('Email send error:', err);
      }
    });
  }
}