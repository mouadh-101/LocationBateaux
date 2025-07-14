import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BoatService } from '../../../services/boats.service';
import { Boat, Image } from '../../../interfaces/boats';
import { Router } from '@angular/router';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';

@Component({
  selector: 'app-add-boat',
  templateUrl: './add-boats.component.html',
  styleUrls: ['./add-boats.component.css']
})
export class AddBoatComponent implements OnInit, OnDestroy {

  @ViewChild('imageUploader') imageUploaderComponent!: ImageUploadComponent;


  boat: Boat = {
    nom: '',
    description: '',
    prix: 0,
    port: {
      nom: ''
    },
    carecteristique: {
      capacite: 0,
      longueur: 0,
      largeur: 0,
      nombreMoteurs: 0,
      type: 'AUTRE'
    },
    images: [],
    reservationTypeSettings: {
      full_day_enabled: true,
      half_day_enabled: true,
      two_hours_enabled: true
    }
  };

  imageUrl: string = '';

  constructor(private boatService: BoatService, private router: Router) { }

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

  saveBoat(): void {
    this.boat.images = this.imageUploaderComponent.getImages();
    console.log(this.boat);
    this.boatService.addBoat(this.boat).subscribe({
      next: () => {
        alert('Bateau ajouté avec succès ✅');
        this.router.navigate(['/list']);
      },
      error: err => {
        console.error('Erreur ajout bateau :', err);
        alert("Erreur lors de l'ajout.");
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}
