import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, UserRegister, UserStats } from '../interfaces/user';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }
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
  updatePassword(updatePassword: { curentPassword: string, newPassword: string }): Observable<void> {
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
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user).pipe(
      tap(updatedUser => {
        // Mettre à jour le BehaviorSubject avec le user modifié
        if (this.currentUserSubject.value?.id === updatedUser.id) {
          this.currentUserSubject.next(updatedUser);
        }
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

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`);
  }

  addUserWithRandomPassword(user: Omit<UserRegister, 'password'>): Observable<any> {
    return this.http.post(`${this.baseUrl}/random-password`, user);
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
}
