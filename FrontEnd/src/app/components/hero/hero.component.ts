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
      date: ['', Validators.required],
      nbPersonnes: [2, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
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
        date: this.searchForm.value.date
          ? this.formatDateToLocalDateTime(this.searchForm.value.date)
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
    const dateControl = this.searchForm.get('date');

    if (dateControl) {
      const dateElement = document.getElementById('date') as HTMLInputElement;
      if (dateElement) dateElement.min = today;
    }
  }

  


  

  resetForm() {
    this.searchForm.reset({
      port: '',
      date: '',
      nbPersonnes: 1
    });
  }


  get f() {
    return this.searchForm.controls;
  }


}
