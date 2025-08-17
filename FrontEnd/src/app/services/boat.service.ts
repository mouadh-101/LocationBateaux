import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Boat, BoatFilter, ServiceBoat } from '../interfaces/boat';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';
import { Port } from '../interfaces/port';

@Injectable({
  providedIn: 'root'
})
export class BoatService {
  private baseUrl = 'http://localhost:8081/api/bateaux';

  constructor(private http: HttpClient, private router: Router) { }
  getBoats(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.baseUrl}/list`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  getFeaturedBataux(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.baseUrl}/list/top5`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  getBateuxById(bateauId: number): Observable<Boat> {
    return this.http.get<Boat>(`${this.baseUrl}/${bateauId}`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  favoritBateau(bateauId: number): Observable<Boat> {
    return this.http.put<Boat>(`${this.baseUrl}/favorit/${bateauId}`, {}).pipe(
      tap(response => {
        console.log('Bateau favorited successfully:', response);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  getFavoritBateaux(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.baseUrl}/favorit`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  getFilteredBoats(searchDetails: BoatFilter): Observable<Boat[]> {
    const params = new HttpParams({
      fromObject: {
        port: searchDetails.port,
        date: searchDetails.date ? this.formatDate(searchDetails.date) : '',
        nbPersonnes: searchDetails.nbPersonnes
      }
    });

    return this.http.get<Boat[]>(`${this.baseUrl}/list/search`, { params }).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  private formatDate(date: Date): string {
    return date.toString()
  }
  getAllService(): Observable<ServiceBoat[]> {
    return this.http.get<ServiceBoat[]>(`http://localhost:8081/api/services`);
  }
  getAllPorts(): Observable<Port[]> {
    return this.http.get<Port[]>(`http://localhost:8081/api/ports`);
  }
  addBoat(boat: Boat): Observable<Boat> {
    return this.http.post<Boat>(this.baseUrl, boat);
  }

  // Modifier un bateau (PUT)
  editBoat(id: number, boat: Boat): Observable<Boat> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Boat>(url, boat);
  }

  // Supprimer un bateau (DELETE)
  deleteBoat(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  updateBoat(id: number, boat: Boat): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, boat);
  }
  getBoatsByUser(): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.baseUrl}/listBpU`);

  }

}
