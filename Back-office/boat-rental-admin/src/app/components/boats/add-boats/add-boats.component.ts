import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BoatService } from '../../../services/boats.service';
import { Boat, Image, serviceBoat } from '../../../interfaces/boats';
import { Router } from '@angular/router';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { AuthService } from 'src/app/services/auth.service';

import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-add-boat',
  templateUrl: './add-boats.component.html',
  styleUrls: ['./add-boats.component.css'],
  animations: [
    trigger('stepTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100px)' }))
      ])
    ])
  ]
})
export class AddBoatComponent implements OnInit, OnDestroy {

  @ViewChild('imageUploader') imageUploaderComponent!: ImageUploadComponent;
  admin = false
  servicesDisponibles: serviceBoat[] = [];
  selectedServices: serviceBoat[] = [];
  newServiceName: string = '';
  step: number = 1;

  boat: Boat = {
    nom: '',
    description: '',
    prix: 0,
    commission: 0,
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
      two_hours_enabled: true,
      fullDayPrice: 0,
      halfDayPrice: 0,
      twoHoursPrice: 0,
    },
    services: [],
  };

  imageUrl: string = '';

  constructor(private boatService: BoatService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    document.body.style.backgroundImage = "url('')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    this.admin = this.authService.isAdmin();
    this.boatService.getAllService().subscribe({
      next: (services: serviceBoat[]) => {
        this.servicesDisponibles = services;
      },
      error: err => console.error("Erreur services :", err)
    });
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
    this.boat.services = this.selectedServices;
    console.log(this.boat);
    this.boatService.addBoat(this.boat).subscribe({
      next: () => {
        alert('Bateau Ajouté Avec Succès ✅');
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
  toggleService(service: serviceBoat): void {
    const index = this.selectedServices.findIndex(s => s.nom === service.nom);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
  }
  addNewService(): void {
    const trimmed = this.newServiceName.trim();
    if (trimmed && !this.servicesDisponibles.some(s => s.nom === trimmed)) {
      const newService: serviceBoat = { nom: trimmed };
      this.servicesDisponibles.push(newService);
      this.selectedServices.push(newService);
      this.newServiceName = '';
    }
  }
  isServiceSelected(service: serviceBoat): boolean {
    return this.selectedServices.some(s => s.nom === service.nom);
  }
  nextStep() {
    if (this.step < 5) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }
  isStep(stepNum: number): boolean {
    return this.step === stepNum;
  }
  isFormStepValid(): boolean {
    switch (this.step) {
      case 1:
        return (
          !!this.boat.nom &&
          this.boat.nom.length >= 3 &&
          this.boat.nom.length <= 50 &&
          !!this.boat.description &&
          this.boat.description.length >= 10 &&
          this.boat.description.length <= 300 &&
          this.boat.prix != null &&
          this.boat.prix >= 0 &&
          !!this.boat.port?.nom &&
          this.boat.port.nom.length >= 2
        );
      case 2:
        const char = this.boat.carecteristique;
        return (
          char.capacite >= 1 &&
          char.longueur >= 0.1 &&
          char.largeur >= 0.1 &&
          char.nombreMoteurs >= 0 &&
          !!char.type
        );
      case 3:
        // If admin, validate; else skip
        return this.admin ? true : true; // Adjust if you want service selection required
      case 4:
        // Validate that at least one pricing is enabled and valid
        const settings = this.boat.reservationTypeSettings;
        const hasFull = settings.full_day_enabled && settings.fullDayPrice >= 0;
        const hasHalf = settings.half_day_enabled && settings.halfDayPrice >= 0;
        const hasTwo = settings.two_hours_enabled && settings.twoHoursPrice >= 0;
        return hasFull || hasHalf || hasTwo;
      default:
        return true;
    }
  }

}
