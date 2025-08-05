import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoatService } from '../../../services/boats.service';
import { Boat, serviceBoat } from '../../../interfaces/boats';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { AuthService } from 'src/app/services/auth.service';

import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-edit-boat',
  templateUrl: './edit-boats.component.html',
  styleUrls: ['./edit-boats.component.css'],
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
export class EditBoatComponent implements OnInit {
  @ViewChild('imageUploader') imageUploaderComponent!: ImageUploadComponent;

  boatId!: number;
  boat: Boat = this.createEmptyBoat();
  servicesDisponibles: serviceBoat[] = [];
  selectedServices: serviceBoat[] = [];
  newServiceName: string = '';
  step: number = 1;
  admin = false;

  constructor(
    private route: ActivatedRoute,
    private boatService: BoatService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.admin = this.authService.isAdmin();
    this.boatId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadBoat();
    this.loadServices();
  }

  createEmptyBoat(): Boat {
    return {
      nom: '',
      description: '',
      prix: 0,
      commission: 0,
      port: { nom: '' },
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
  }

  loadBoat(): void {
    this.boatService.getBoatById(this.boatId).subscribe({
      next: (data: Boat) => {
        this.boat = {
          ...data,
          carecteristique: data.carecteristique ?? this.createEmptyBoat().carecteristique,
          port: data.port ?? { nom: '' },
          reservationTypeSettings: data.reservationTypeSettings ?? this.createEmptyBoat().reservationTypeSettings,
          services: data.services ?? [],
          images: data.images ?? []
        };
        this.selectedServices = [...this.boat.services];
      },
      error: err => console.error('Erreur chargement bateau :', err)
    });
  }

  loadServices(): void {
    this.boatService.getAllService().subscribe({
      next: (services: serviceBoat[]) => this.servicesDisponibles = services,
      error: err => console.error('Erreur services :', err)
    });
  }

  toggleService(service: serviceBoat): void {
    const index = this.selectedServices.findIndex(s => s.nom === service.nom);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
  }

  isServiceSelected(service: serviceBoat): boolean {
    return this.selectedServices.some(s => s.nom === service.nom);
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

  updateBoat(): void {
    this.boat.images = this.imageUploaderComponent.getImages();
    this.boat.services = this.selectedServices;
    console.log(this.boat)

    this.boatService.updateBoat(this.boatId, this.boat).subscribe({
      next: () => {
        alert('Bateau Mis à Jour Avec Succès ✅');
        this.router.navigate(['/list']);
      },
      error: err => {
        console.error('Erreur mise à jour bateau :', err);
        alert('Erreur lors de la mise à jour.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }

  isStep(stepNum: number): boolean {
    return this.step === stepNum;
  }

  nextStep() {
    if (this.step < 5) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  isFormStepValid(): boolean {
    switch (this.step) {
      case 1:
        return (
          !!this.boat.nom && this.boat.nom.length >= 3 &&
          !!this.boat.description && this.boat.description.length >= 10 &&
          this.boat.prix != null && this.boat.prix >= 0 &&
          !!this.boat.port?.nom && this.boat.port.nom.length >= 2
        );
      case 2:
        const c = this.boat.carecteristique;
        return (
          c.capacite >= 1 &&
          c.longueur >= 0.1 &&
          c.largeur >= 0.1 &&
          c.nombreMoteurs >= 0 &&
          !!c.type
        );
      case 3:
        return true;
      case 4:
        const s = this.boat.reservationTypeSettings;
        return (
          (s.full_day_enabled && s.fullDayPrice >= 0) ||
          (s.half_day_enabled && s.halfDayPrice >= 0) ||
          (s.two_hours_enabled && s.twoHoursPrice >= 0)
        );
      default:
        return true;
    }
  }
}
