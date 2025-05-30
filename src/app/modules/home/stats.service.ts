import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private apiUrl = environment.apiUrl;

  getAllDrivers(): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}/statistics/drivers`);
  }

  getAllVehiculos(): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}/statistics/vehicles`);
  }

  getAllUsers(): Observable<any>{
        return this.httpClient.get<any>(`${this.apiUrl}/admin`);
  }

  getRoutesToday(): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}/statistics/routes`);
  }


}
