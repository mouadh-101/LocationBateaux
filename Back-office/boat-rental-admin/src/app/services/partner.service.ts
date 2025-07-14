import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Partner } from '../interfaces/Partner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private baseUrl  = 'http://localhost:8081/api/partner';

  constructor(private http: HttpClient) {}

  getAllPartners(): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${this.baseUrl }/list`);
  }

  getPartnerById(id: number): Observable<Partner> {
    return this.http.get<Partner>(`${this.baseUrl }/${id}`);
  }

addPartner(partner: Partner): Observable<Partner> {
  return this.http.post<Partner>(`${this.baseUrl }`, partner);
}


  updatePartner(id: number, partner: Partner): Observable<Partner> {
    return this.http.put<Partner>(`${this.baseUrl }/${id}`, partner);
  }

  deletePartner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl }?id=${id}`);
  }
}
