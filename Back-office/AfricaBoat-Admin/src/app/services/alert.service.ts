import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlertType = 'success' | 'error' | 'warning' | 'banned';

export interface AlertMessage {
  message: string;
  type: AlertType;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);

  get alerts$(): Observable<AlertMessage | null> {
    return this.alertSubject.asObservable();
  }

  showAlert(message: string, type: AlertType = 'success') {
    this.alertSubject.next({ message, type });

    // Optionally clear alert after 3 seconds:
    setTimeout(() => this.clearAlert(), 2000);
  }

  clearAlert() {
    this.alertSubject.next(null);
  }
}
