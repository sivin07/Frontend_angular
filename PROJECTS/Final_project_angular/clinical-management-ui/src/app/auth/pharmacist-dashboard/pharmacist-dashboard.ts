import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-pharmacist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pharmacist-dashboard.html'
})
export class PharmacistComponent {
  role: string | null = '';

  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
