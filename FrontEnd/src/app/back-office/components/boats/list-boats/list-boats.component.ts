import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { BoatService } from 'src/app/services/boat.service';
import { Boat } from 'src/app/interfaces/boat';
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

  sortBy: string = 'name-asc';
  availabilityFilter: 'all' | 'available' | 'unavailable' = 'all';

  constructor(private boatService: BoatService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getBoats();
  }

  getBoats(): void {
    if (this.authService.isGestionnaire()) {
      this.boatService.getBoatsByUser().subscribe({
        next: (data) => {
          this.boats = data;
          this.applyFiltersAndSorting();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des bateaux :', err);
        }
      });

    }
    if (this.authService.isAdmin()) {
      this.boatService.getBoats().subscribe({
        next: (data) => {
          console.log('Bateaux chargés :', data);
          this.boats = data;
          this.applyFiltersAndSorting();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des bateaux :', err);
        }
      });
    }
  }

  applyFiltersAndSorting(): void {
    this.filteredBoats = this.boats.filter(boat => {
      if (this.availabilityFilter === 'available') return boat.disponible === true;
      if (this.availabilityFilter === 'unavailable') return boat.disponible === false;
      return true;
    });

    switch (this.sortBy) {
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
      case 'recent':
        // TODO: trier par date si disponible
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

  viewBoatDetails(id: number): void {
    this.router.navigate(['/admin/boat-details', id]);
  }

  editBoat(boat: Boat, event: Event) {
    event.stopPropagation(); // Empêche la propagation du clic à la card
    if (boat.bateauxId) {
      this.router.navigate(['/admin/edit-boat', boat.bateauxId]);
    }
  }

  deleteBoat(id: number, event: Event) {
    event.stopPropagation(); // Empêche la propagation du clic à la card
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bateau ?')) {
      this.boatService.deleteBoat(id).subscribe(() => {
        alert('Bateau Supprimé Avec Succès ✅');
        this.getBoats();
      });
    }
  }

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

  // Gestion de l'image affichée (caroussel simple)
  prevImage(boat: Boat): void {
    const b = boat as any;
    if (!b.images || b.images.length === 0) return;
    b.currentImageIndex = (b.currentImageIndex ?? 0) - 1;
    if (b.currentImageIndex < 0) b.currentImageIndex = b.images.length - 1;
  }

  nextImage(boat: Boat): void {
    const b = boat as any;
    if (!b.images || b.images.length === 0) return;
    b.currentImageIndex = (b.currentImageIndex ?? 0) + 1;
    if (b.currentImageIndex >= b.images.length) b.currentImageIndex = 0;
  }

  getCurrentImageUrl(boat: Boat): string {
    const b = boat as any;
    if (!b.images || b.images.length === 0) return '';
    const index = b.currentImageIndex ?? 0;
    return b.images[index].url;
  }
}
