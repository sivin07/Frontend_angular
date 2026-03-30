import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReceptionistService } from '../../services/receptionist';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
  providers: [DatePipe]
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  searchTerm: string = '';
  selectedDate: string = '';
  todayString: string = '';

  constructor(
    private service: ReceptionistService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.todayString = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    this.loadAllAppointments();
  }

  loadAllAppointments() {
    this.service.getAllAppointments().subscribe({
      next: (data: any) => {
        this.appointments = data;
      },
      error: (err: any) => {
        console.error('Load all appointments error:', err);
      }
    });
  }

  loadTodayAppointments() {
    this.selectedDate = this.todayString;
    this.service.searchAppointments('', this.selectedDate).subscribe({
      next: (data: any) => {
        this.appointments = data;
      },
      error: (err: any) => {
        console.error('Today appointments error:', err);
      }
    });
  }

  searchAppointments() {
    const term = this.searchTerm.trim();
    const date = this.selectedDate.trim();

    if (!term && !date) {
      this.loadAllAppointments();
      return;
    }

    this.service.searchAppointments(term, date).subscribe({
      next: (data: any) => {
        this.appointments = data;
      },
      error: (err: any) => {
        console.error('Search appointments error:', err);
      }
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDate = '';
    this.loadAllAppointments();
  }

  isToday(appointmentDate: string): boolean {
    return appointmentDate === this.todayString;
  }

  openBilling(appointmentId: number) {
    this.router.navigate(['/receptionist/billing'], {
      queryParams: { appointmentId }
    });
  }
}