import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReceptionistService } from '../../services/receptionist.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
  providers: [DatePipe]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  searchTerm = '';
  selectedDate = '';
  todayString = '';

  constructor(
    private service: ReceptionistService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.todayString = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    this.loadAllAppointments();
  }

  loadAllAppointments(): void {
    this.service.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => {
        console.error('Load appointments error:', err);
      }
    });
  }

  loadTodayAppointments(): void {
    this.selectedDate = this.todayString;
    this.searchAppointments();
  }

  searchAppointments(): void {
    const term = this.searchTerm.trim();
    const date = this.selectedDate.trim();

    if (!term && !date) {
      this.loadAllAppointments();
      return;
    }

    this.service.searchAppointments(term, date).subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => {
        console.error('Search appointments error:', err);
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDate = '';
    this.loadAllAppointments();
  }

  openBilling(appointmentId: number): void {
    this.router.navigate(['/receptionist/billing'], {
      queryParams: { appointmentId }
    });
  }
}