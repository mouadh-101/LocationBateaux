import { Component } from '@angular/core';
import { Boat } from 'src/app/interfaces/boat';
import { BoatService } from 'src/app/services/boat.service';
import { MokeDataService } from 'src/app/services/moke-data.service';

@Component({
  selector: 'app-featured-boat',
  templateUrl: './featured-boat.component.html',
  styleUrls: ['./featured-boat.component.css']
})
export class FeaturedBoatComponent {
  boats: Boat[] = [];

  constructor(private boatService:BoatService) {}

  ngOnInit() {
    this.boatService.getFeaturedBataux().subscribe((boats) => {
      this.boats = boats;
    });
  }

  trackByBoatId(index: number, boat: Boat): number {
    return boat.bateauxId;
  }
  

}
