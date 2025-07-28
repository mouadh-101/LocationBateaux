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
  private baseUrl = 'http://localhost:8081/api/paiement';
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
  getAllPaimentsByUserId(): Observable<Paiment[]> {
    return this.http.get<Paiment[]>(`${this.baseUrl}/list/user`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  createStripeSession(paimentId: number): Observable<{ sessionId: string }> {
    return this.http.post<{ sessionId: string }>(`${this.baseUrl}/${paimentId}/stripe-session`,{}).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  updatePaiment(paimentId: number,paiement:any):Observable<Paiment>{
    return this.http.put<Paiment>(`${this.baseUrl}/${paimentId}`,paiement).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  createPaypalOrder(paimentId: number): Observable<{ approvalUrl: string }> {
  return this.http.get<{ approvalUrl: string }>(`${this.baseUrl}/${paimentId}/paypal-order`);
}

  
}
