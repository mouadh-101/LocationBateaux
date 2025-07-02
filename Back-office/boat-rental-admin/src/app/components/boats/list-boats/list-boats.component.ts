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
  paginatedBoats: Boat[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // Critère de tri
  sortBy: string = 'recent'; // Valeur par défaut

  constructor(private boatService: BoatService, private router: Router) {}

  ngOnInit(): void {
    this.getBoats();
  }

  getBoats(): void {
    this.boatService.getAllBoats().subscribe({
      next: (data) => {
        console.log('Bateaux récupérés depuis le backend :', data);
        this.boats = data;
        this.applySorting(); // Appliquer le tri initial
      },
      error: (err) => {
        console.error('Erreur lors du chargement des bateaux :', err);
      }
    });
  }

  updatePaginatedBoats(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBoats = this.boats.slice(startIndex, startIndex + this.itemsPerPage);
    this.totalPages = Math.ceil(this.boats.length / this.itemsPerPage);
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

  applySorting(): void {
    switch (this.sortBy) {
      case 'recent':
      case 'price-asc':
        this.boats.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        this.boats.sort((a, b) => b.prix - a.prix);
        break;
      case 'name-asc':
        this.boats.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'name-desc':
        this.boats.sort((a, b) => b.nom.localeCompare(a.nom));
        break;
      default:
        break;
    }

    this.currentPage = 1; // Réinitialiser à la première page après le tri
    this.updatePaginatedBoats();
  }

  editBoat(boat: Boat) {
    if (boat.bateauxId) {
      this.boatService.editBoat(boat.bateauxId, boat).subscribe(updatedBoat => {
        console.log('Bateau mis à jour', updatedBoat);
      });
    }
  }

  deleteBoat(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bateau ?')) {
      this.boatService.deleteBoat(id).subscribe(() => {
        console.log('Bateau supprimé');
        this.getBoats(); // Rafraîchir la liste après suppression
      });
    }
  }
}
