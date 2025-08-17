import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoatService } from 'src/app/services/boat.service';
import { Boat } from 'src/app/interfaces/boat';

@Component({
  selector: 'app-boat-details-admin',
  templateUrl: './details-boats-admin.component.html',
  styleUrls: ['./details-boats-admin.component.css']
})
export class DetailsBoatsAdminComponent implements OnInit, OnDestroy {
  boat: Boat | null = null;
  error: string = '';
  loading: boolean = true;

  currentImageIndex: number = 0;
  private imageIntervalId: any;

  constructor(
    private route: ActivatedRoute,
    private boatService: BoatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.boatService.getBateuxById(id).subscribe({
        next: (data) => {
          this.boat = data;
          this.loading = false;

          if (this.boat.images && this.boat.images.length > 1) {
            this.startImageSlideshow();
          }
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement du bateau.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.stopImageSlideshow();
  }

  startImageSlideshow(): void {
    this.imageIntervalId = setInterval(() => {
      if (this.boat && this.boat.images && this.boat.images.length > 0) {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.boat.images.length;
      }
    }, 3000); // Change image toutes les 3 secondes
  }

  stopImageSlideshow(): void {
    if (this.imageIntervalId) {
      clearInterval(this.imageIntervalId);
    }
  }

  getCurrentImageUrl(): string {
    if (!this.boat || !this.boat.images || this.boat.images.length === 0) return '';
    return this.boat.images[this.currentImageIndex].url;
  }

  getAverageRating(boat: Boat): number {
    if (!boat.avis || boat.avis.length === 0) return 0;
    const total = boat.avis.reduce((sum, a) => sum + a.note, 0);
    return total / boat.avis.length;
  }


  goBack(): void {
    this.router.navigate(['/admin/list']);
  }
}
