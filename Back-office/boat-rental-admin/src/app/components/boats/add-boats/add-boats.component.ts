import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoatService } from '../../../services/boats.service';
import { Boat } from '../../../interfaces/boats';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-boat',
  templateUrl: './add-boats.component.html',
  styleUrls: ['./add-boats.component.css']
})
export class AddBoatComponent implements OnInit, OnDestroy {
  boat: Boat = {
    nom: '',
    description: '',
    prix: 0,
    port:{
      nom:''
    },
    carecteristique: {
      capacite: 0,
      longueur: 0,
      largeur: 0,
      nombreMoteurs: 0,
      type: 'AUTRE' // valeur par défaut
    },
    images: []
  };

  imageUrl: string = '';

  constructor(private boatService: BoatService, private router: Router) {}

  ngOnInit(): void {
    document.body.style.backgroundImage = "url('')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }

  ngOnDestroy(): void {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundAttachment = '';
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

  saveBoat(): void {
    console.log(this.boat)
    this.boatService.addBoat(this.boat).subscribe({
      next: () => {
        alert('Bateau ajouté avec succès ✅');
        this.router.navigate(['/list']);
      },
      error: err => {
        console.error('Erreur ajout bateau :', err);
        alert('Erreur lors de l\'ajout.');
      }
    });
  }
}
