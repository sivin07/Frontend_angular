import { Component } from '@angular/core';
import { Pendingtest } from '../../models/pendingtest';
import { Compledresult } from '../../models/compledresult';
import { LabtechService } from '../../services/labtech.service';
import { Labresult } from '../../models/labresult';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-labtestpending',
  imports: [CommonModule, FormsModule],
  templateUrl: './labtestpending.html',
  styleUrl: './labtestpending.css',
})
export class Labtestpending {
  pendingTests: Pendingtest[] = [];

  // 🔥 LIVE SEARCH
  searchText: string = '';
  allTests: Pendingtest[] = [];

  selectedTest: Pendingtest | null = null;
  showModal: boolean = false;

  labResult: Labresult = new Labresult();

  constructor(
    private labService: LabtechService,
    private toastr: ToastrService // 🔥 ADD
  ) {}

  ngOnInit(): void {
    this.loadPendingTests();
  }

  loadPendingTests() {
    this.labService.getPendingTests().subscribe({
      next: (data) => {
        this.pendingTests = data;
        this.allTests = data; // 🔥 store original
      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 LIVE SEARCH FUNCTION
  filterTests() {
    const search = this.searchText.toLowerCase().trim();

    this.pendingTests = this.allTests.filter(test =>
      test.Patient?.Name?.toLowerCase().includes(search)
    );
  }

  openModal(test: Pendingtest) {
    this.selectedTest = test;
    this.showModal = true;
    this.labResult = new Labresult();
  }

  closeModal() {
    this.showModal = false;
    this.selectedTest = null;
    this.labResult = new Labresult();
  }

  submitResult() {
    if (!this.selectedTest) return;

    this.labService
      .completeLabTest(this.selectedTest.PrescriptionId, this.labResult)
      .subscribe({
        next: () => {
          this.closeModal();
          this.loadPendingTests();

          // 🔥 TOASTR SUCCESS
          this.toastr.success('Lab result added successfully', 'Success');
        },
        error: (err) => {
          console.error("ERROR:", err);

          // 🔥 TOASTR ERROR
          this.toastr.error('Failed to submit result', 'Error');
        }
      });
  }

}
