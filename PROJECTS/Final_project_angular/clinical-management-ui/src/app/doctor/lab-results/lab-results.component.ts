import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../services/doctor.service';
import { LabResultDto } from '../models/doctor.models';

@Component({
  selector: 'app-lab-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './lab-results.component.html',
  styleUrls: ['./lab-results.component.css']
})
export class LabResultsComponent implements OnInit {
  results: LabResultDto[] = [];
  selectedDate: string;
  isLoading = false;
  errorMessage = '';

  selectedDetail: LabResultDto | null = null;
  isLoadingDetail = false;
  detailError = '';

  constructor(private doctorService: DoctorService, private datePipe: DatePipe) {
    // Default to today
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.fetchResults();
  }

  fetchResults(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.results = [];

    this.doctorService.getLabResults(this.selectedDate).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.results = res.data;
        } else {
          this.errorMessage = res.message;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load lab results. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  viewResultDetail(labRequestId: number): void {
    this.isLoadingDetail = true;
    this.selectedDetail = null;
    this.detailError = '';

    // Simulate opening a modal using Bootstrap's JS API via attributes 
    // or just relying on Angular binding in the template.

    this.doctorService.getLabResultDetail(labRequestId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedDetail = res.data;
        } else {
          this.detailError = res.message;
        }
        this.isLoadingDetail = false;
      },
      error: (err) => {
        this.detailError = 'Failed to load specific lab result details.';
        this.isLoadingDetail = false;
      }
    });
  }

  closeDetail(): void {
    this.selectedDetail = null;
  }
}
