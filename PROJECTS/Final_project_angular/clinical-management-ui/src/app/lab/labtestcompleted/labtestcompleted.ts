import { Component } from '@angular/core';
import { LabtechService } from '../../services/labtech.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-labtestcompleted',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './labtestcompleted.html',
  styleUrl: './labtestcompleted.css',
})
export class Labtestcompleted {
  // 🔥 search
  searchText: string = '';

  // 🔥 original + filtered
  allReports: any[] = [];
  filteredReports: any[] = [];

  constructor(
    private labService: LabtechService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.labService.getLabReports().subscribe({
      next: (data) => {
        console.log("REPORTS:", data);

        this.allReports = data;
        this.filteredReports = data; // initial load
      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 LIVE SEARCH (by patient name)
  filterReports() {
    const search = this.searchText.toLowerCase().trim();

    this.filteredReports = this.allReports.filter(report =>
      report.Patient?.Name?.toLowerCase().includes(search)
    );
  }

  // 🔥 Print functionality
  printReport(report: any) {
    const content = `
      <h2>Lab Report</h2>
      <p><strong>Result ID:</strong> RI-${report.ResultId}</p>
      <p><strong>Patient:</strong> ${report.Patient?.Name}</p>
      <p><strong>Test:</strong> ${report.Test?.TestName}</p>
      <p><strong>Result:</strong> ${report.ActualValue}</p>
      <p><strong>Remarks:</strong> ${report.Remarks}</p>
      <p><strong>Date:</strong> ${report.Date}</p>
      <p><strong>Price:</strong> ₹ ${report.Test?.Price}</p>
    `;

    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow!.document.write(content);
    newWindow!.document.close();
    newWindow!.print();

    this.router.navigate(['/dashboard/labtech']);
  }
}
