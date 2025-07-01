// error-handel.util.ts (or any filename you prefer)
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export class ErrorHandlerUtil {
  static handleError(error: HttpErrorResponse) {
    let message = 'Une erreur inconnue s\'est produite';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      message = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      message = error.error?.message || `Erreur serveur: ${error.status}`;
    }

    return throwError(() => new Error(message));
  }
}
