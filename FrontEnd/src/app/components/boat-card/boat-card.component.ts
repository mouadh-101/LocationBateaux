import { Component,Input } from '@angular/core';
import { Boat } from 'src/app/interfaces/boat';

@Component({
  selector: 'app-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.css']
})
export class BoatCardComponent {
  @Input() boat!: Boat;
  onSeeMore() {
    console.log('Voir plus pour le bateau:', this.boat.nom);
    // Navigation logic will be added later
  }

}
