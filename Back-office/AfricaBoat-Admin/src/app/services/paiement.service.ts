// paiement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaiementData } from '../interfaces/paiment-data.model';


@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:8081/api/paiement';

  constructor(private http: HttpClient) { }

  getAllPaiements(): Observable<PaiementData[]> {
    return this.http.get<PaiementData[]>(`${this.apiUrl}/list`);
  }

  getPaiementsForGestionnaire(): Observable<PaiementData[]> {
    return this.http.get<PaiementData[]>(`${this.apiUrl}/Paie-gest`);
  }
}
