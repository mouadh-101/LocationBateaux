import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoatService } from '../../../services/boats.service';
import { Boat } from '../../../interfaces/boats';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-boat',
  templateUrl: './edit-boats.component.html',
  styleUrls: ['./edit-boats.component.css']
})
export class EditBoatComponent implements OnInit {

  @ViewChild('imageUploader') imageUploaderComponent!: ImageUploadComponent;

  boatId!: number;
  role=false;

  boat: Boat = {
    nom: '',
    description: '',
    prix: 0,
    commission:0,
    port: { nom: '' },
    disponible: true,
    carecteristique: {
      capacite: 0,
      longueur: 0,
      largeur: 0,
      nombreMoteurs: 0,
      type: 'AUTRE'
    },
    reservationTypeSettings: {
      full_day_enabled: true,
      half_day_enabled: true,
      two_hours_enabled: true,
      fullDayPrice: 0,
      halfDayPrice: 0,
      twoHoursPrice: 0,
    },
    images: []
  };

  imageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private boatService: BoatService,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.boatId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBoatDetails();
    this.role=this.authService.isAdmin();
  }

  getBoatDetails(): void {
    this.boatService.getBoatById(this.boatId).subscribe({
      next: (data) => {
        this.boat = {
          ...data,
          carecteristique: data.carecteristique || {
            capacite: 0,
            longueur: 0,
            largeur: 0,
            nombreMoteurs: 0,
            type: 'AUTRE'
          },
          reservationTypeSettings: data.reservationTypeSettings || {
            full_day_enabled: true,
            half_day_enabled: true,
            two_hours_enabled: true
          },
          port: data.port || { nom: '' },
          images: data.images || [],
          disponible: data.disponible ?? true,
          commission:data.commission,
        };
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
    this.boat.images = this.imageUploaderComponent.getImages();
    this.boatService.updateBoat(this.boatId, this.boat).subscribe({
      next: () => {
        alert('Bateau mis à jour avec succès ✅');
        this.router.navigate(['/list']);
      },
      error: (err) => {
        console.error('Erreur mise à jour :', err);
        alert('Erreur lors de la mise à jour.');
      }
    });
  }
}
