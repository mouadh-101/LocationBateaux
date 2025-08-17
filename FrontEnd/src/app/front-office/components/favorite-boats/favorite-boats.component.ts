import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoatService } from 'src/app/services/boat.service';
import { Boat } from 'src/app/interfaces/boat';

interface CategoryFilter {
  value: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-favorite-boats',
  templateUrl: './favorite-boats.component.html',
  styleUrls: ['./favorite-boats.component.css']
})
export class FavoriteBoatsComponent implements OnInit {
  favoriteBoats: Boat[] = [];
  filteredFavorites: Boat[] = [];
  loading = true;
  viewMode: 'grid' | 'list' = 'grid';
  activeCategory = 'all';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';




  constructor(
    public router: Router,
    private boatService: BoatService,
    
  ) { }

  ngOnInit() {
    this.loadFavoriteBoats();
  }

  loadFavoriteBoats() {
    this.loading = true;

    this.boatService.getFavoritBateaux().subscribe(
      boats => {
        this.favoriteBoats = boats;
        this.filteredFavorites = [...this.favoriteBoats];
        this.loading = false;
      },
      error => {
        console.error('Error loading favorite boats:', error);
        this.loading = false;
      }
    );
  }


  applySorting() {
    this.filteredFavorites.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = a.nom.localeCompare(b.nom);
          break;
        case 'price':
          comparison = a.prix - b.prix;
          break;

        case 'dateAdded':
          // Assuming we have a dateAdded field or use ID as proxy
          comparison = a.bateauxId - b.bateauxId;
          break;
        case 'capacite':
          comparison = a.carecteristique.capacite - b.carecteristique.capacite;
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applySorting();
  }


  getAveragePrice(): number {
    if (this.favoriteBoats.length === 0) return 0;
    const total = this.favoriteBoats.reduce((sum, boat) => sum + boat.prix, 0);
    return total / this.favoriteBoats.length;
  }



  goToBoatDetails(boatId: number) {
    this.router.navigate(['/boats', boatId]);
  }


  trackByBoatId(index: number, boat: Boat): number {
    return boat.bateauxId;
  }
}