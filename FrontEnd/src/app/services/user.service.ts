import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, UserStats } from '../interfaces/user';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient, private router: Router){ }
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      catchError(ErrorHandlerUtil.handleError),
    );
  }
  updatePersonalInfo(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}`, user).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  updatePassword(updatePassword: {curentPassword: string, newPassword: string}): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    
    return this.http.put<void>(`${this.baseUrl}/changePassword`, updatePassword, { headers }).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.baseUrl}/me/stats`).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }
}
