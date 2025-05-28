import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { invitationCodeListResponse } from '../models/invitation-codes.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private apiUrl: string = environment.apiUrl;

  getAllInvitationCodes(): Observable<invitationCodeListResponse>{
    return this.httpClient.get<invitationCodeListResponse>(`${this.apiUrl}/invitationCode`);
  }
}
