import { Component, OnInit } from '@angular/core';
import { PartnerService } from '../../../services/partner.service';
import { Partner } from '../../../interfaces/Partner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partner.component.html',
  styleUrls: ['./list-partner.component.css']
})
export class ListPartnersComponent implements OnInit {

  partners: Partner[] = [];
  filteredPartners: Partner[] = [];
  pagedPartners: Partner[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

  selectedFilter: string = 'nom';
  searchTerm: string = '';

  constructor(private partnerService: PartnerService, private router: Router) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading = true;
    this.partnerService.getAllPartners().subscribe({
      next: (data) => {
        this.partners = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des partenaires.";
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let result = [...this.partners];

    // 🔍 Recherche
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => p.nom.toLowerCase().includes(term));
    }

    // 📊 Tri
    if (this.selectedFilter === 'nom') {
      result.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (this.selectedFilter === 'recent') {
      result.reverse(); // suppose que les plus récents sont à la fin
    }

    this.filteredPartners = result;
    this.totalPages = Math.ceil(result.length / this.pageSize);
    this.currentPage = 1;
    this.setPagedPartners();
  }

  setPagedPartners(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedPartners = this.filteredPartners.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPagedPartners();
  }

  deletePartner(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    this.partnerService.deletePartner(id).subscribe({
      next: () => {
        this.partners = this.partners.filter(p => p.partnerId !== id);
        this.applyFilter();
        this.successMessage = 'Partenaire supprimé avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de la suppression du partenaire.";
        console.error(err);
      }
    });
  }

  goToAddPartner(): void {
    this.router.navigate(['/partners/add']);
  }

  editPartner(partner: Partner): void {
    this.router.navigate(['/partners/edit', partner.partnerId]);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}
