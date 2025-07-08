import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boat } from '../interfaces/boats';

@Injectable({
  providedIn: 'root'
})
export class BoatService {
  private apiUrl = 'http://localhost:8081/api/bateaux';

  constructor(private http: HttpClient) {}

  getAllBoats(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.apiUrl}/list`);
  }

  getBoatById(id: number): Observable<Boat> {
    return this.http.get<Boat>(`${this.apiUrl}/${id}`);
  }

  getTop5Boats(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.apiUrl}/list/top5`);
  }

  addBoat(boat: Boat): Observable<Boat> {
    return this.http.post<Boat>(this.apiUrl, boat);
  }

    // Modifier un bateau (PUT)
  editBoat(id: number, boat: Boat): Observable<Boat> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Boat>(url, boat);
  }

  // Supprimer un bateau (DELETE)
  deleteBoat(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  updateBoat(id: number, boat: Boat): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, boat);
}




}



