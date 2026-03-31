import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AuthResponse } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        const role = response.Role.toLowerCase();
        
        if (role === 'receptionist') {
          this.router.navigate(['/dashboard/reception']);
        } else if (role === 'doctor') {
          this.router.navigate(['/dashboard/doctor']);
        } else if (role === 'pharmacist') {
          this.router.navigate(['/pharmacist/dashboard']);
        } else if (role === 'labtech' || role === 'labtechnician' || role === 'lab technician') {
          this.router.navigate(['/dashboard/labtech']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        console.error('Login error', error);
      }
    });
  }
}
