import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { PortAdd } from 'src/app/interfaces/port';
import { PortService } from 'src/app/services/port.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  ports: PortAdd[] = [];
  searchForm: FormGroup;

  constructor(private portService: PortService, private fb: FormBuilder, private router: Router) {
    this.searchForm = this.fb.group({
      port: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nbPersonnes: [2, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
    this.searchForm.addValidators(this.dateRangeValidator.bind(this));
  }
  



  ngOnInit() {
    this.portService.getPorts().subscribe({
      next: (ports: PortAdd[]) => {
        this.ports = ports;
      }
      , error: (error) => {
        console.error('Error fetching ports:', error);
      }
    });
  }
  onSubmit() {
    if (this.searchForm.valid) {
      const searchDetails = {
        port: this.searchForm.value.port,
        dateDebut: this.searchForm.value.dateDebut
          ? this.formatDateToLocalDateTime(this.searchForm.value.dateDebut)
          : null,
        dateFin: this.searchForm.value.dateFin
          ? this.formatDateToLocalDateTime(this.searchForm.value.dateFin)
          : null,
        nbPersonnes: this.searchForm.value.nbPersonnes
      };

      this.router.navigate(['/boats'], { queryParams: searchDetails });
    }
  }
  formatDateToLocalDateTime(date: string | Date): string {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
  }
  setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateDebutControl = this.searchForm.get('dateDebut');
    const dateFinControl = this.searchForm.get('dateFin');
    
    if (dateDebutControl && dateFinControl) {
      // Set minimum date to today
      const dateDebutElement = document.getElementById('dateDebut') as HTMLInputElement;
      const dateFinElement = document.getElementById('dateFin') as HTMLInputElement;
      
      if (dateDebutElement) dateDebutElement.min = today;
      if (dateFinElement) dateFinElement.min = today;

      // Update end date minimum when start date changes
      dateDebutControl.valueChanges.subscribe(startDate => {
        if (startDate && dateFinElement) {
          dateFinElement.min = startDate;
          // Clear end date if it's before the new start date
          if (dateFinControl.value && dateFinControl.value < startDate) {
            dateFinControl.setValue('');
          }
        }
      });
    }
  }

  dateRangeValidator(control: AbstractControl) {
    const form = control as FormGroup;
    const startDate = form.get('dateDebut')?.value;
    const endDate = form.get('dateFin')?.value;
    
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }


  setQuickFilter(filterType: string) {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filterType) {
      case 'weekend':
        // Next weekend (Saturday to Sunday)
        const daysUntilSaturday = (6 - today.getDay()) % 7;
        startDate = new Date(today);
        startDate.setDate(today.getDate() + daysUntilSaturday);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        break;
        
      case 'week':
        // Next week (7 days)
        startDate = new Date(today);
        startDate.setDate(today.getDate() + 1);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
        
        
      default:
        return;
    }

    this.searchForm.patchValue({
      dateDebut: this.formatDateForInput(startDate),
      dateFin: this.formatDateForInput(endDate)
    });
  }

  resetForm() {
    this.searchForm.reset({
      port: '',
      dateDebut: '',
      dateFin: '',
      nbPersonnes: 1
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private markFormGroupTouched() {
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Getter for easy access to form controls in template
  get f() {
    return this.searchForm.controls;
  }


}
