import { Component } from '@angular/core';
import { Boat } from 'src/app/interfaces/boat';
import { MokeDataService } from 'src/app/services/moke-data.service';

@Component({
  selector: 'app-featured-boat',
  templateUrl: './featured-boat.component.html',
  styleUrls: ['./featured-boat.component.css']
})
export class FeaturedBoatComponent {
  boats: Boat[] = [];

  constructor(private mockDataService: MokeDataService) {}

  ngOnInit() {
    this.boats = this.mockDataService.getBoats();
  }

  trackByBoatId(index: number, boat: Boat): number {
    return boat.bateauxId;
  }

}
