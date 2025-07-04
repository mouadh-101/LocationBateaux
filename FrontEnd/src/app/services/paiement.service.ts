import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';
import { Paiment } from '../interfaces/paiment';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private baseUrl = 'http://localhost:8081/api/paiements';
  constructor(private http: HttpClient, private router: Router) {}

  addPaiment(paiement: Paiment,idReservation:number): Observable<Paiment> {
    return this.http.post<Paiment>(`${this.baseUrl}/${idReservation}`, paiement).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  getPaimentsById(idPaiment: number): Observable<Paiment> {
    return this.http.get<Paiment>(`${this.baseUrl}/${idPaiment}`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  
}
