import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationAdd } from '../interfaces/reservation-add';
import { ReservationData } from '../interfaces/reservation-data';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8081/api/reservation';

  constructor(private http: HttpClient) {}

  /**
   * Ajouter une réservation à un bateau spécifique
   */
  addReservation(reservation: ReservationAdd, bateauId: number): Observable<ReservationData> {
    return this.http.post<ReservationData>(`${this.apiUrl}/${bateauId}`, reservation);
  }

  /**
   * Récupérer toutes les réservations (admin)
   */
  getAllReservations(): Observable<ReservationData[]> {
    return this.http.get<ReservationData[]>(`${this.apiUrl}/list`);
  }

  /**
   * Récupérer les réservations de l'utilisateur connecté
   */
  getUserReservations(): Observable<ReservationData[]> {
    return this.http.get<ReservationData[]>(`${this.apiUrl}/current-user`);
  }

  /**
   * Supprimer une réservation
   */
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Mettre à jour une réservation existante
   */
  updateReservation(id: number, data: ReservationData): Observable<ReservationData> {
    return this.http.put<ReservationData>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Récupérer une réservation par ID
   */
  getReservationById(id: number): Observable<ReservationData> {
    return this.http.get<ReservationData>(`${this.apiUrl}/${id}`);
  }
}
