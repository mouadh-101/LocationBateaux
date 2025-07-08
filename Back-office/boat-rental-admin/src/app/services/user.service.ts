import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient, private router: Router){ }
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      catchError(err => {
        console.error('Error fetching boats:', err);
        return throwError(() => new Error('Failed to fetch boats'));
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

    banUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/ban/${id}`, null);
  }

  unbanUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/unBan/${id}`, null);
  }

  getUserById(id: number): Observable<User> {
  return this.http.get<User>(`${this.baseUrl}/${id}`);
}

updateUser(id: number, user: User): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/${id}`, user);
}

}
