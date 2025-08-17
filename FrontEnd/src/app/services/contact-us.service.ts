import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  open() {
    this.modalState.next(true);
  }

  close() {
    this.modalState.next(false);
  }
  private apiUrl = 'http://localhost:8081/api/contact';
  
    constructor(private http: HttpClient) {}
  
    sendMessage(contactMessage: ContactMessage): Observable<any> {
      return this.http.post(this.apiUrl, contactMessage);
    }
}
export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
