import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorHandlerUtil } from 'src/util/errorHandlerUtil';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:5000/chat';

  constructor(private http: HttpClient, private router: Router) { }

  sendChatMessage(question: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.baseUrl}`, { question })
      .pipe(
        catchError(ErrorHandlerUtil.handleError)
      );;
  }
}
