import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class JWTInterceptor implements HttpInterceptor{
  
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access');
    req = req.clone({withCredentials: true, headers: req.headers.set('Authorization', 'Bearer ' + token)});
    return next.handle(req).pipe(
      catchError((error) => {
          if (error.status === 401 && token){
            return this.handleTokenExpired(req, next);
          }
          return throwError(() => error);
        }
      )
    );
  }

  handleTokenExpired(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.refresh().pipe(
      switchMap(() => {
        const token = localStorage.getItem('access');
        req = req.clone({withCredentials: true, headers: req.headers.set('Authorization', 'Bearer ' + token)});
        return next.handle(req);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }
  
}


export const httpInterceptorProvider = {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true,};