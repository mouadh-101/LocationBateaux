import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoatService } from '../../../services/boats.service';
import { Boat } from '../../../interfaces/boats';

@Component({
  selector: 'app-boat-details',
  templateUrl: './details-boats.component.html',
  styleUrls: ['./details-boats.component.css']
})
export class BoatDetailsComponent implements OnInit {
  boat: Boat | null = null;
  error: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private boatService: BoatService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.boatService.getBoatById(id).subscribe({
        next: (data) => {
          this.boat = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement du bateau.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  getAverageRating(boat: Boat): number {
    if (!boat.avis || boat.avis.length === 0) return 0;
    const total = boat.avis.reduce((sum, a) => sum + a.note, 0);
    return total / boat.avis.length;
  }
}
