import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Avis, Boat } from 'src/app/interfaces/boat';
import { AuthModalService } from 'src/app/services/auth-modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { AvisService } from 'src/app/services/avis.service';
import { BoatService } from 'src/app/services/boat.service';


@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.css']
})
export class BoatDetailsComponent {
  boat: Boat | null = null;
  loading = true;
  reservationForm: FormGroup
  isLoggedIn: boolean = false;
 
  

  constructor(private boatService: BoatService, public router: Router, public route: ActivatedRoute, private fb: FormBuilder,private authService:AuthService,private avisService: AvisService,private authModalService:AuthModalService) {
    this.reservationForm = this.fb.group({
      dateDebut: [new Date(), Validators.required],
      dateFin: [new Date(), Validators.required],
    });
    
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const boatId = +params['id'];
      this.loadBoatDetails(boatId);
    });
    this.isLoggedIn= this.authService.isLoggedIn();
    
  }
  loadBoatDetails(batauxId: number) {
    this.boatService.getBateuxById(batauxId).subscribe({
      next: (data: Boat) => {
        this.boat = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching boat details:', err);
        this.loading = false;
      }
    });
  }
  onReserve() {
    if (this.authService.isLoggedIn()) {
      console.log('Redirecting to reservation details:', this.reservationForm);
      alert('Redirection vers les détails de réservation (à implémenter)');
    } else {
      this.authModalService.open();
    }
  }
  getBoatRating(boat: Boat): number {
    if (!boat.avis || boat.avis.length === 0) {
      return 0; // ou une valeur par défaut (ex: 3)
    }
    const total = boat.avis.reduce((sum, avis) => sum + avis.note, 0);
    const average = total / boat.avis.length;
    return Math.round(average);
  }
  calculateTotalPrice(startDate: Date, endDate: Date, pricePerDay: number): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysDiff > 0 ? daysDiff * pricePerDay : 0; // Ensure positive days
  }
  calculateDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysDiff > 0 ? daysDiff : 0; // Ensure positive days
  }

  

}
