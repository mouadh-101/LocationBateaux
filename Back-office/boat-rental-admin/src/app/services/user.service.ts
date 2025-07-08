import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadCurrentUser();

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
  
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      catchError(err => {
        console.error('Error fetching user:', err);
        return throwError(() => new Error('Failed to fetch user'));
      })
    );
  }

  private loadCurrentUser() {
    this.getMe().subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null)
    });
  }

  refreshCurrentUser() {
    this.loadCurrentUser();
  }


}
