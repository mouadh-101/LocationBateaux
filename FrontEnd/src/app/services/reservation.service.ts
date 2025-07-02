import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Reservation, ReservationAdd } from '../interfaces/reservation';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';

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
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  getReservationById(reservationId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${reservationId}`).pipe(
      tap(response => {
        console.log('Reservation fetched successfully:', response);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  cancelReservation(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reservationId}`).pipe(
      tap(() => {
        console.log('Reservation cancelled successfully');
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  updateReservation(reservationId: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${reservationId}`, reservation).pipe(
      tap(response => {
        console.log('Reservation updated successfully:', response);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  myReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/current-user`).pipe(
      tap(response => {
        console.log('My reservations fetched successfully:', response);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
}
