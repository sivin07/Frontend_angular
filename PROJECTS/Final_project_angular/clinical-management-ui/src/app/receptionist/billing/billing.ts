import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReceptionistService } from '../../services/receptionist.service';
import { Bill } from '../../models/bill.model';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class BillingComponent implements OnInit {
  appointmentId = 0;
  billData: Bill | null = null;
  emailToSend = '';

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

  loadBill(): void {
    if (!this.appointmentId) {
      alert('Select an appointment first');
      return;
    }

    this.service.getConsultationBill(this.appointmentId).subscribe({
      next: (data) => {
        this.billData = data;
        this.emailToSend = data.patientEmail || '';
      },
      error: (err) => {
        console.error('Bill load error:', err);
        this.billData = null;
      }
    });
  }

  downloadPdf(): void {
    if (!this.billData) {
      alert('Please load a bill first.');
      return;
    }

    try {
      // 1. We try the backend endpoint first
      this.service.downloadBillPdf(this.appointmentId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ConsultationBill_${this.appointmentId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Backend PDF download failed, falling back to frontend print:', err);
          this.frontendPrintFallback();
        }
      });
    } catch (e) {
      this.frontendPrintFallback();
    }
  }

  private frontendPrintFallback(): void {
    if (!this.billData) return;
    
    const printContents = `
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; font-family: Arial, sans-serif;">
        <h2 style="text-align: center; color: #333;">Consultation Bill</h2>
        <hr/>
        <p><strong>Appointment ID:</strong> ${this.billData.appointmentId}</p>
        <p><strong>Patient ID:</strong> ${this.billData.patientId}</p>
        <p><strong>Patient Name:</strong> ${this.billData.patientName}</p>
        <p><strong>MMR No:</strong> ${this.billData.mmrNo}</p>
        <p><strong>Email:</strong> ${this.billData.patientEmail}</p>
        <p><strong>Doctor ID:</strong> ${this.billData.doctorId}</p>
        <p><strong>Token Number:</strong> ${this.billData.tokenNumber}</p>
        <p><strong>Appointment Date:</strong> ${this.billData.appointmentDate}</p>
        <p><strong>Status:</strong> ${this.billData.status}</p>
        <h3 style="text-align: right;">Total Fee: Rs. ${this.billData.doctorFee}</h3>
      </div>
    `;

    const popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Bill _${this.billData.appointmentId}</title>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin.document.close();
    } else {
      alert('Popup blocked. Please allow popups for this site to view the printable bill.');
    }
  }

  sendEmail(): void {
    if (!this.appointmentId || !this.emailToSend.trim()) {
      alert('Enter a valid email');
      return;
    }

    // Try backend email endpoint
    this.service.emailBill(this.appointmentId, this.emailToSend).subscribe({
      next: (res) => {
        alert(res.message || 'Bill emailed successfully via server');
      },
      error: (err) => {
        console.error('Backend Email failed, falling back to mailto link:', err);
        
        // Frontend Fallback
        if (this.billData) {
          const subject = `Consultation Bill - Appointment ${this.appointmentId}`;
          let body = `Dear ${this.billData.patientName},\r\n\r\n`;
          body += `Here are the details for your consultation bill:\r\n`;
          body += `- Appointment ID: ${this.billData.appointmentId}\r\n`;
          body += `- Doctor ID: ${this.billData.doctorId}\r\n`;
          body += `- Total Fee: Rs. ${this.billData.doctorFee}\r\n`;
          body += `- Date: ${this.billData.appointmentDate}\r\n\r\n`;
          body += `Thank you.\r\n`;
          
          window.location.href = `mailto:${this.emailToSend}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
      }
    });
  }
}