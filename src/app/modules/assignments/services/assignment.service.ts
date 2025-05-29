import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
    private apiUrl = `${environment.apiUrl}/assignments`;

  constructor(private http: HttpClient) { }

  getAssignments(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`);
  }

  getAssignmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createAssignment(assignment: any): Observable<any> {
    return this.http.post(this.apiUrl, assignment);
  }

  updateAssignment(id: number, assignment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, assignment);
  }

  deleteAssignment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}