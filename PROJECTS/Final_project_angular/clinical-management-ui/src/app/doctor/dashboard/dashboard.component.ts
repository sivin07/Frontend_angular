import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { AppointmentDto } from '../models/doctor.models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  appointments: AppointmentDto[] = [];
  todayAppointments: AppointmentDto[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.doctorService.getDashboardAppointments().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.appointments = res.data;
          this.filterTodayAppointments();
        } else {
          this.errorMessage = res.message || 'Failed to load appointments';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while fetching appointments.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filterTodayAppointments(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.todayAppointments = this.appointments.filter(app => {
      const appDate = new Date(app.appointmentDate);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === today.getTime();
    });
  }
}
