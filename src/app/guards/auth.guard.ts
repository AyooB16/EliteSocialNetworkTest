import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   let authService = inject(AuthService);
//   let routerService = inject(Router);
//   if (!authService.isLoggedIn()) {
//     routerService.navigate(['/login']);
//     return false;
//   }
//   return true;
// };
export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (tokenService.isTokenNotValid()) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
