import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';
import { PortAdd } from '../interfaces/port';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  private baseUrl = 'http://localhost:8081/api/ports';
  constructor(private http: HttpClient, private router: Router) {}
  getPorts(): Observable<PortAdd[]> {
    return this.http.get<PortAdd[]>(`${this.baseUrl}`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
}
