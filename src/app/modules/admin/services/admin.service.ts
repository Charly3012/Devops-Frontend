import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createCodeRequest, createCodeResponse, editCodeRequest, invitationCodeListResponse } from '../models/invitation-codes.models';
import { environment } from 'src/environments/environment';
import { getAllAdminsResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private apiUrl: string = environment.apiUrl;

  // invitation codes request to back


  getAllInvitationCodes(): Observable<invitationCodeListResponse>{
    return this.httpClient.get<invitationCodeListResponse>(`${this.apiUrl}/invitationCode`);
  }

  createInvitationCode(data: createCodeRequest): Observable<createCodeResponse>{
    return this.httpClient.post<createCodeResponse>(`${this.apiUrl}/invitationCode`, data);
  }

  deleteInvitationCode(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.apiUrl}/invitationCode/${id}`);
  }
  editInvitationCode(data: editCodeRequest, id: number): Observable<any>{
    return this.httpClient.put<any>(`${this.apiUrl}/invitationCode/${id}`, data);
  }

  // admin request to back
  getAllAdmins(): Observable<getAllAdminsResponse> {
    const headers = new HttpHeaders().set("X-Skip-error-handler", "true")
    return this.httpClient.get<getAllAdminsResponse>(`${this.apiUrl}/admin`, {headers});
  }
  deleteAdmin(id: number): Observable<any>{
    return this.httpClient.get<getAllAdminsResponse>(`${this.apiUrl}/admin`);
  }
}
