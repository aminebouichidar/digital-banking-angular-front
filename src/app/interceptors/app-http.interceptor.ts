import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.includes("/auth/login")){
      let newReq = request.clone({
        headers : request.headers.set("Authorization", "Bearer "+this.authService.accessToken)
      })
      return next.handle(newReq).pipe(
        (response) => {
          return response;
        },
        (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.authService.logout();
          }
          return error;
        }
      )
    }
    else{
      return next.handle(request);
    }
  }
}
