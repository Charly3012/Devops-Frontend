import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { registerReponse, registerRequest } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private apiUrl: string = environment.apiUrl;

  public login(){

  }

  public register(data: registerRequest): Observable<registerReponse>{
    return this.httpClient.post<registerReponse>(`${this.apiUrl}/admin`, data);
  }

}
