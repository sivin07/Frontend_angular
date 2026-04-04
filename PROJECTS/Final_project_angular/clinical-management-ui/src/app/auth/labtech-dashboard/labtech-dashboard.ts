import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Labtestpending } from '../../lab/labtestpending/labtestpending';

@Component({
  selector: 'app-labtech',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './labtech-dashboard.html'
})
export class LabtechComponent {
  role: string | null = '';
  pendingCount: number = 0;
  completedCount: number = 0;

  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getRole();
  }

  goToPendingTests() {
    this.router.navigate(['/labtech/pending']);
 }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
