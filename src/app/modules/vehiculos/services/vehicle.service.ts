import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
   private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(vehicleData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, vehicleData);
  }

  getVehicles(page: number = 1) {
  return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  update(id: number, vehicleData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/${id}?_method=PUT`, vehicleData); // simulando PUT para Laravel
  }

}
