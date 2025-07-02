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
export function dateRangeValidator(startControlName: string, endControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get(startControlName)?.value;
      const end = formGroup.get(endControlName)?.value;
  
      if (start && end && new Date(end) < new Date(start)) {
        return { endBeforeStart: true };
      }
      return null;
    };
  }
  export function noOverlapValidator(reservations: Reservation[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = new Date(formGroup.get('dateDebut')?.value);
      const end = new Date(formGroup.get('dateFin')?.value);
  
      if (!start || !end) return null;
  
      for (const res of reservations) {
        if (res.status !== 'ACCEPTER') continue;
  
        const resStart = new Date(res.dateDebut);
        const resEnd = new Date(res.dateFin);
  
        // Check if ranges overlap
        if (start <= resEnd && end >= resStart) {
          return { overlap: true };
        }
      }
      return null;
    };
  }
    