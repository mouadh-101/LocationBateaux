import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Reservation, ReservationAdd } from '../interfaces/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'http://localhost:8081/api/reservation';
  constructor(private http: HttpClient, private router: Router) {}

  addReservation(reservation: ReservationAdd,boatId:number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/${boatId}`, reservation).pipe(
      tap(response => {
        console.log('Reservation added successfully:', response);
      }),
      catchError(err => {
        console.error('Error adding avis:', err);
        return throwError(() => new Error('Failed to add reservation'));
      })
    );
  }
  getReservationById(reservationId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${reservationId}`).pipe(
      tap(response => {
        console.log('Reservation fetched successfully:', response);
      }),
      catchError(err => {
        console.error('Error fetching reservation:', err);
        return throwError(() => new Error('Failed to fetch reservation'));
      })
    );
  }
  cancelReservation(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reservationId}`).pipe(
      tap(() => {
        console.log('Reservation cancelled successfully');
      }),
      catchError(err => {
        console.error('Error cancelling reservation:', err);
        return throwError(() => new Error('Failed to cancel reservation'));
      })
    );
  }
  updateReservation(reservationId: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${reservationId}`, reservation).pipe(
      tap(response => {
        console.log('Reservation updated successfully:', response);
      }),
      catchError(err => {
        console.error('Error updating reservation:', err);
        return throwError(() => new Error('Failed to update reservation'));
      })
    );
  }
}
