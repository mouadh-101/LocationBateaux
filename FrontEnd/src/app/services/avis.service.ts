import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Avis } from '../interfaces/boat';

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
      catchError(err => {
        console.error('Error adding avis:', err);
        return throwError(() => new Error('Failed to add avis'));
      })
    );
  }
  deleteAvis(avisId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${avisId}`).pipe(
      tap(() => {
        console.log('Avis deleted successfully');
      }),
      catchError(err => {
        console.error('Error deleting avis:', err);
        return throwError(() => new Error('Failed to delete avis'));
      })
    );
  }
  updateAvis(avis: Avis): Observable<Avis> {
    return this.http.put<Avis>(`${this.baseUrl}/${avis.avisId}`, avis).pipe(
      tap(response => {
        console.log('Avis updated successfully:', response);
      }),
      catchError(err => {
        console.error('Error updating avis:', err);
        return throwError(() => new Error('Failed to update avis'));
      })
    );
  }


  
}
