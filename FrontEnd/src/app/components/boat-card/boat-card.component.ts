import { Component,Input } from '@angular/core';
import { Router } from '@angular/router';
import { Boat } from 'src/app/interfaces/boat';

@Component({
  selector: 'app-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.css']
})
export class BoatCardComponent {
  @Input() boat!: Boat;
  constructor(public router: Router) {}
  onSeeMore(batauxId:number) {
    this.router.navigate(['/boat-details',batauxId]);
  }
  getBoatRating(boat: Boat): number {
    if (!boat.avis || boat.avis.length === 0) {
      return 0; // ou une valeur par défaut (ex: 3)
    }

    const total = boat.avis.reduce((sum, avis) => sum + avis.note, 0);
    const average = total / boat.avis.length;

    return Math.round(average); // ou `parseFloat(average.toFixed(1))` pour une décimale
  }

}
