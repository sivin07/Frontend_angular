import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-labtech',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labtech-dashboard.html'
})
export class LabtechComponent {
  role: string | null = '';

  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
