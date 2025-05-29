import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.authService.getToken();
    const currentRoute = this.router.url;
    const isAuthRoute = currentRoute.startsWith('/auth');
    const skipJwt = request.headers.has('X-skip-jwt-interceptor');


    //To skip validations to jwt interceptor
    if(skipJwt){
      const clonedRequest = request.clone({
        headers: request.headers.delete('X-skip-jwt-interceptor')
      })
      return next.handle(clonedRequest);
    }

    //If is AuthRoute don't need a jwt at headers
    if(isAuthRoute){
      return next.handle(request);
    }

    //Add jwt to all request to backend
    let authRequest = request;
    if(token && !isAuthRoute){
      authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authRequest).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 401){
          this.toastService.error('Inicie sesión nuevamente', 'Error de autenticación');
          this.authService.logOut();
        }

        return throwError(() => err);
      }
      )
    )

  }
}
