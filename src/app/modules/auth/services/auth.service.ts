import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { loginRequest, loginResponse } from '../models/login.model';
import { registerReponse, registerRequest } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastrService,
    private router: Router
  ) { }

  private apiUrl: string = environment.apiUrl;

  public register(data: registerRequest): Observable<registerReponse>{
    return this.httpClient.post<registerReponse>(`${this.apiUrl}/admin`, data);
  }

  public login(data: loginRequest): Observable<loginResponse>{
    return this.httpClient.post<loginResponse>(`${this.apiUrl}/login`, data);
  }

  setToken(token:string){
    sessionStorage.setItem('token', token);
  }

  getToken():string | null {
    const token = sessionStorage.getItem('token');

    if(token){
      return token;
    }
    return null;

  }

  logOut(){
    this.toastService.info("Cerrando sesión...");
    sessionStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

}
