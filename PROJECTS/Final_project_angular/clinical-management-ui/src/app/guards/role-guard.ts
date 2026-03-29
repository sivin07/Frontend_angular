import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data?.['role'];
  const userRole = authService.getRole();

  if (authService.isLoggedIn() && expectedRole && userRole) {
    // Ignore case and whitespace to be resilient to backend variations
    const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
    
    const uRole = normalize(userRole);
    const eRole = normalize(expectedRole);

    if (uRole === eRole || (eRole === 'labtechnician' && uRole === 'labtech')) {
      return true;
    }
  }

  console.warn(`Role Guard Blocked Navigation: Expected [${expectedRole}] but user had [${userRole}]`);
  return router.createUrlTree(['/login']);
};
