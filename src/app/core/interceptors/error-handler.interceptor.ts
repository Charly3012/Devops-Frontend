import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private toastService: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const skipHandler = request.headers.has('X-Skip-error-handler');
    if(skipHandler){
      const clonedRequest = request.clone({
        headers: request.headers.delete('X-Skip-error-handler')
      })
      return next.handle(clonedRequest);
    }


    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status >= 400 && err.status <= 499 && err.status != 401){ //401 Error handled by jwt interceptor
          const message = err.error?.message || 'Verifique nuevamente';
          this.toastService.warning(message, 'Error de validación');

          const specificErrors: { [key: string]: string[] } = err.error?.errors;
          if (specificErrors) {
            Object.keys(specificErrors).forEach((field) => {
              specificErrors[field].forEach((msg: string) => {
                this.toastService.warning(msg, `Campo: ${field}`);
              });
            });
          }
        }

        if (err.status >= 500) {
          const message = err.error?.message || 'Ocurrió un error inesperado, intente de nuevo mas tarde';
          this.toastService.error(message, 'Error interno');
        }

        return throwError(() => err);
      })
    );


  }
}
