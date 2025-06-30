import { Component } from '@angular/core';
import { BoatService } from '../../../services/boats.service';
import { Boat } from '../../../interfaces/boats';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-boat',
  templateUrl: './add-boats.component.html',
  styleUrls: ['./add-boats.component.css']
})
export class AddBoatComponent {
  boat: Boat = {
    nom: '',
    description: '',
    prix: 0,
    images: []
  };

  imageUrl: string = '';

  constructor(private boatService: BoatService, private router: Router) {}

  addImage(): void {
    if (this.imageUrl.trim() !== '') {
      this.boat.images.push({ url: this.imageUrl });
      this.imageUrl = '';
    }
  }

  removeImage(index: number): void {
    this.boat.images.splice(index, 1);
  }

  saveBoat(): void {
    this.boatService.addBoat(this.boat).subscribe({
      next: () => {
        alert('Bateau ajouté avec succès ✅');
        this.router.navigate(['/list-boat']);
      },
      error: err => {
        console.error('Erreur ajout bateau :', err);
        alert('Erreur lors de l\'ajout.');
      }
    });
  }
}
