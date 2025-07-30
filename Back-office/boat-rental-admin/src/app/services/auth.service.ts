import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserRegister, UserLogin, JwtPayload, User } from '../interfaces/user';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';
import { catchError, tap } from 'rxjs/operators';

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
    // NE PAS appeler loadUserFromStorage() ici pour éviter la dépendance cyclique
  }

  login(user: UserLogin): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/loginAdmin`, user).pipe(
      tap(response => this.handleAuthSuccess(response.token)),
      catchError(ErrorHandlerUtil.handleError)
    );
  }

  register(user: UserRegister): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user).pipe(
      catchError(ErrorHandlerUtil.handleError)
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.authState.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  private handleAuthSuccess(token: string) {
    if (!token) return;

    localStorage.setItem('token', token);

    const role = this.decodeRoleFromToken(token);
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }

    this.authState.next(true);

    const id = this.decodeIdFromToken();
    if (id) {
      this.http.get<User>(`http://localhost:8081/api/users/${id}`).subscribe({
        next: (user) => this.setCurrentUser(user),
        error: (err) => console.error('Erreur chargement user après login', err),
      });
    }
  }

  loadUserFromStorage(): void {
    if (this.userLoaded) return;
    this.userLoaded = true;

    const token = this.token;
    if (token && !this.isTokenExpired(token)) {
      const role = this.decodeRoleFromToken(token);
      if (role) {
        localStorage.setItem('role', role);
      }
      this.authState.next(true);

      const id = this.decodeIdFromToken();
      if (id) {
        this.http.get<User>(`http://localhost:8081/api/users/${id}`).subscribe({
          next: (user) => this.setCurrentUser(user),
          error: (err) => console.error('Erreur chargement user au démarrage', err),
        });
      }
    }
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
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

  isGestionnaire(): boolean {
    return this.role === 'GESTIONNAIRE';
  }

  emitAuthState() {
    this.authState.next(this.isLoggedIn());
  }
}
