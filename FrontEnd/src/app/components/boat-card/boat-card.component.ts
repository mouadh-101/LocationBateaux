import { Component,Input } from '@angular/core';
import { Router } from '@angular/router';
import { Boat } from 'src/app/interfaces/boat';
import { AlertService } from 'src/app/services/alert.service';
import { AuthModalService } from 'src/app/services/auth-modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { BoatService } from 'src/app/services/boat.service';

@Component({
  selector: 'app-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.css']
})
export class BoatCardComponent {
  @Input() boat!: Boat;
  isLoggedIn: boolean = false;
  favorites: number[] = [];
  constructor(public router: Router,private boatService:BoatService,private authModalService : AuthModalService,private authService: AuthService,private alertService: AlertService) {}
  ngOnInit() {
    this.authService.authState$.subscribe({
      next: (isLoggedIn) => {
        this.isLoggedIn=isLoggedIn;
      }});
    this.loadFavorites();
  }
  loadFavorites() {
    if (this.isLoggedIn) {
      this.boatService.getFavoritBateaux().subscribe({
        next: (favorites) => {
          this.favorites = favorites.map((boat) => boat.bateauxId);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des favoris:', err);
        }
      });
    }
    console.log('Favorites loaded:', this.favorites);
    
  }
  onSeeMore(batauxId:number) {
    this.router.navigate(['/boat-details',batauxId]);
  }

  onFavorit(bateauxId: number): void {
    if (!this.isLoggedIn) {
      this.authModalService.open();
      return;
    }
    this.boatService.favoritBateau(bateauxId).subscribe({
      next: (boat) => {
        const isAlreadyFavorite = this.favorites.includes(boat.bateauxId);
        if (isAlreadyFavorite) {
          this.favorites = this.favorites.filter(id => id !== boat.bateauxId);
          this.alertService.showAlert('Bateau retiré des favoris avec succès.', 'success');
        } else {
          this.favorites.push(boat.bateauxId);
          this.alertService.showAlert('Bateau ajouté aux favoris avec succès.', 'success');
        }
      },
      error: (err) => {
        this.alertService.showAlert(err.message, 'error');
      }
    });
  }
  
  isFavorite(boatId: number): boolean {
    return this.favorites.includes(boatId);
  }
  getBoatRating(): number {
    const boat = this.boat;
    if (!boat.avis|| boat.avis.length === 0) {
      return 0; // ou une valeur par défaut (ex: 3)
    }

    const total = boat.avis.reduce((sum, avis) => sum + avis.note, 0);
    const average = total / boat.avis.length;

    return Math.round(average); // ou `parseFloat(average.toFixed(1))` pour une décimale
  }

}
