import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Reservation } from '../interfaces/reservation';

export function dateNotPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset time part
    
    if (date < today) {
      return { dateInPast: true };
    }
    return null;
  };
}

  export function noOverlapValidator(reservations: Reservation[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const date = new Date(formGroup.get('date')?.value);
  
      if (!date) return null;
  
      for (const res of reservations) {
        if (res.status !== 'ACCEPTER') continue;
        const resDate = new Date(res.date);
        // Check if ranges overlap
        if (date==res.date) {
          return { overlap: true };
        }
      }
      return null;
    };
  }
    