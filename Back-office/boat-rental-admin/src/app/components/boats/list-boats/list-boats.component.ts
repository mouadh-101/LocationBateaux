import { Component, OnInit } from '@angular/core';
import { BoatService } from '../../../services/boats.service';
import { Boat } from '../../../interfaces/boats';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-boat',
  templateUrl: './list-boats.component.html',
  styleUrls: ['./list-boats.component.css']
})
export class ListBoatsComponent implements OnInit {
  boats: Boat[] = [];
  filteredBoats: Boat[] = [];
  paginatedBoats: Boat[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // Critères de tri et filtre
  sortBy: string = 'name-asc'; // 'recent', 'price-asc', 'price-desc', 'name-asc', 'name-desc'
  availabilityFilter: 'all' | 'available' | 'unavailable' = 'all';

  constructor(private boatService: BoatService, private router: Router) {}

  ngOnInit(): void {
    this.getBoats();
  }

  getBoats(): void {
    this.boatService.getAllBoats().subscribe({
      next: (data) => {
        this.boats = data;
        this.applyFiltersAndSorting();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des bateaux :', err);
      }
    });
  }

  applyFiltersAndSorting(): void {
    // Filtrage par disponibilité
    this.filteredBoats = this.boats.filter(boat => {
      if (this.availabilityFilter === 'available') return boat.disponible === true;
      if (this.availabilityFilter === 'unavailable') return boat.disponible === false;
      return true; // all
    });

    // Tri
    switch (this.sortBy) {

      case 'recent':
        // Si tu as une date, trie par date sinon par id décroissant (exemple)
        // this.filteredBoats.sort((a, b) => b.id - a.id);
        break;
      case 'price-asc':
        this.filteredBoats.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        this.filteredBoats.sort((a, b) => b.prix - a.prix);
        break;
      case 'name-asc':
        this.filteredBoats.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'name-desc':
        this.filteredBoats.sort((a, b) => b.nom.localeCompare(a.nom));
        break;
    }

    this.currentPage = 1;
    this.updatePaginatedBoats();
  }

  updatePaginatedBoats(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBoats = this.filteredBoats.slice(startIndex, startIndex + this.itemsPerPage);
    this.totalPages = Math.ceil(this.filteredBoats.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedBoats();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedBoats();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedBoats();
    }
  }

  getAverageRating(boat: Boat): number {
    if (!boat.avis || boat.avis.length === 0) return 0;
    const total = boat.avis.reduce((sum: number, a: any) => sum + a.note, 0);
    return total / boat.avis.length;
  }

  editBoat(boat: Boat) {
    if (boat.bateauxId) {
      this.router.navigate(['/edit-boat', boat.bateauxId]);
    }
  }

  deleteBoat(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bateau ?')) {
      this.boatService.deleteBoat(id).subscribe(() => {
        alert('Bateau supprimé');
        this.getBoats();
      });
    }
  }

  // Méthodes pour changer le filtre ou le tri via l'UI
  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy = value;
    this.applyFiltersAndSorting();
  }

  onAvailabilityFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'available' | 'unavailable';
    this.availabilityFilter = value;
    this.applyFiltersAndSorting();
  }
}
