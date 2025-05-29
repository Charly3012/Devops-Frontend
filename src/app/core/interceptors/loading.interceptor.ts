import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const skipLoadingFlag = request.headers.has('X-skip-loading');

    if(skipLoadingFlag){
      const clonedRequest = request.clone({
        headers: request.headers.delete('X-skip-loading')
      });

      return next.handle(clonedRequest);
    }

    this.loadingService.show();

    return next.handle(request).pipe(
      finalize(() => {this.loadingService.hide()})
    );
  }
}
