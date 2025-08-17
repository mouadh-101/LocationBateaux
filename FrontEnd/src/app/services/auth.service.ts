import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { User, UserLogin, JwtPayload, AuthenticationResponse } from '../interfaces/user';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  authState$ = this.authState.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private userLoaded = false;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(user: UserLogin): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, user).pipe(
      tap(response => {
        this.handleAuthSuccess(response.token);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }

  register(user: User): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/register`, user).pipe(
      tap(response => {
        this.handleAuthSuccess(response.token);
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }

  private handleAuthSuccess(token: string) {
    if (!token) {
      return;
    }
    localStorage.setItem('token', token);
    const role = this.decodeRoleFromToken(token);
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
    this.authState.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.authState.next(false);
    this.router.navigate(['/']);
  }

  private decodeRoleFromToken(token: string): string | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  }
  public decodeIdFromToken(): number | null {
    try {
      const decoded = jwtDecode<JwtPayload>(localStorage.getItem('token') || '');
      return decoded.id || null;
    } catch {
      return null;
    }
  }

  public isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp ? decoded.exp < Date.now() / 1000 : true;
    } catch {
      return true;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!(token && !this.isTokenExpired(token));
  }

  get role(): string | null {
    return localStorage.getItem('role');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  loadUserFromStorage() {
    const token = this.token;
    if (token && !this.isTokenExpired(token)) {
      const role = this.decodeRoleFromToken(token);
      if (role) {
        localStorage.setItem('role', role);
      }
      this.authState.next(true);
      
    }
  }
  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }


  emitAuthState() {
    this.authState.next(this.isLoggedIn());
  }
  loginWithGoogle(idToken: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/google`, { idToken })
      .pipe(
        tap(response => {
          if (response.status === 'SUCCESS' && response.token) {
            this.handleAuthSuccess(response.token);
          } else {
            console.error('Login failed:', response.message);
          }
        }),
        catchError(ErrorHandlerUtil.handleError)
      );
  }
  loginWithFacebook(accessToken: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/facebook`, { accessToken })
      .pipe(
        tap(response => {
          if (response.status === 'SUCCESS' && response.token) {
            this.handleAuthSuccess(response.token);
          } else {
            console.error('Login failed:', response.message);
          }
        }),
        catchError(ErrorHandlerUtil.handleError)
      )
  }
  requestReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email: email });
  }
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, { token, password }).pipe(
      tap(response => {
        if (response.status === 'SUCCESS') {
          this.handleAuthSuccess(response.token);
        }
      }),
      catchError(ErrorHandlerUtil.handleError)
    );
  }
  isGestionnaire(): boolean {
    return this.role === 'GESTIONNAIRE';
  }


}