import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Boat } from '../interfaces/boat';

@Injectable({
  providedIn: 'root'
})
export class BoatService {
  private baseUrl = 'http://localhost:8081/api/bateaux';

  constructor(private http: HttpClient, private router: Router){ }
  getBoats(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.baseUrl}/list`).pipe(
      catchError(err => {
        console.error('Error fetching boats:', err);
        return throwError(() => new Error('Failed to fetch boats'));
      })
    );
  }
  getFeaturedBataux(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.baseUrl}/list/top5`).pipe(
      catchError(err => {
        console.error('Error fetching boats:', err);
        return throwError(() => new Error('Failed to fetch boats'));
      })
    );
  }
  getBateuxById(bateauId:number): Observable<Boat> {
    return this.http.get<Boat>(`${this.baseUrl}/${bateauId}`).pipe(
      catchError(err => {
        console.error('Error fetching boats:', err);
        return throwError(() => new Error('Failed to fetch boats'));
      })
    );
  }

}
