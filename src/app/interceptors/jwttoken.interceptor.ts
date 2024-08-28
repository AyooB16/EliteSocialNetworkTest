import { HttpInterceptorFn } from '@angular/common/http';

export const jwttokenInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    var cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return next(cloned);
  }
  return next(req);
};

function getJwtToken(): string | null {
  let token: any = localStorage.getItem('token');
  if (!token) return null;

  return token;
}
