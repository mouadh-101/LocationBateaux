import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoatService } from '../../../services/boats.service';
import { Boat } from '../../../interfaces/boats';

@Component({
  selector: 'app-edit-boat',
  templateUrl: './edit-boats.component.html',
  styleUrls: ['./edit-boats.component.css']
})
export class EditBoatComponent implements OnInit {
  boatId!: number;
  boat: Boat = {
    nom: '',
    description: '',
    prix: 0,
    images: [],
  };

  imageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private boatService: BoatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.boatId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBoatDetails();
  }

  getBoatDetails(): void {
    this.boatService.getBoatById(this.boatId).subscribe({
      next: (data) => {
        this.boat = data;
      },
      error: (err) => {
        console.error('Erreur chargement bateau :', err);
        alert('Bateau introuvable.');
      }
    });
  }

  addImage(): void {
    if (this.imageUrl.trim() !== '') {
      this.boat.images.push({ url: this.imageUrl });
      this.imageUrl = '';
    }
  }

  removeImage(index: number): void {
    this.boat.images.splice(index, 1);
  }

  updateBoat(): void {
    this.boatService.updateBoat(this.boatId, this.boat).subscribe({
      next: () => {
        alert('Bateau mis à jour avec succès ✅');
        this.router.navigate(['/list-boat']);
      },
      error: (err) => {
        console.error('Erreur mise à jour :', err);
        alert('Erreur lors de la mise à jour.');
      }
    });
  }
}
