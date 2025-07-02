import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Avis } from '../interfaces/boat';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private baseUrl = 'http://localhost:8081/api/avis';
  constructor(private http: HttpClient, private router: Router) {}

  addAvis(avis: Avis,boatId:number): Observable<Avis> {
    return this.http.post<Avis>(`${this.baseUrl}/${boatId}`, avis).pipe(
      tap(response => {
        console.log('Avis added successfully:', response);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  deleteAvis(avisId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${avisId}`).pipe(
      tap(() => {
        console.log('Avis deleted successfully');
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  updateAvis(avis: Avis): Observable<Avis> {
    return this.http.put<Avis>(`${this.baseUrl}/${avis.avisId}`, avis).pipe(
      tap(response => {
        console.log('Avis updated successfully:', response);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }


  
}
