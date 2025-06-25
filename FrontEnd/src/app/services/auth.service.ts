import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserRegister, UserLogin, JwtPayload } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(user: UserLogin): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, user).pipe(
      tap(response => {
        this.handleAuthSuccess(response.token);
      }),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(user: UserRegister): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user).pipe(
      catchError(err => {
        console.error('Registration error:', err);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  private handleAuthSuccess(token: string) {
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
    this.router.navigate(['/auth']);
  }

  private decodeRoleFromToken(token: string): string | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
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
    return this.role === 'admin';
  }

  private loadUserFromStorage() {
    const token = this.token;
    if (token && !this.isTokenExpired(token)) {
      const role = this.decodeRoleFromToken(token);
      if (role) {
        localStorage.setItem('role', role);
      }
      this.authState.next(true);
    }
  }

  emitAuthState() {
    this.authState.next(this.isLoggedIn());
  }
}