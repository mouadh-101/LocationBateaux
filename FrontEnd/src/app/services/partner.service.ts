import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Partner } from '../interfaces/partner';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private baseUrl = 'http://localhost:8081/api/partner';
  constructor(private http: HttpClient) {}

  getPartners(): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${this.baseUrl}/list`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
}
