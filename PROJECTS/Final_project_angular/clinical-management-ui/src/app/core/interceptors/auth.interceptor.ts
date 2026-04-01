import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Mock JWT Token for testing the Doctor Module (since backend requires DoctorId claim).
  // This is a minimal, non-verifiable token format that some simple backends may accept, 
  // or a placeholder for a real token.
  // We'll set a standard Authorization header which the backend `GetDoctorIdFromClaims()` will read.
  
  // NOTE: For a real application, fetch this from a localStorage token or Auth Service.
  const token = localStorage.getItem('access_token') || 'MOCK_TOKEN_PLACEHOLDER';
  
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(modifiedReq);
};
