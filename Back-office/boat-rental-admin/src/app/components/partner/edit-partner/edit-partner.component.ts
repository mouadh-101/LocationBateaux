import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from '../../../services/partner.service';
import { Partner } from '../../../interfaces/Partner';

@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.css']
})
export class EditPartnerComponent implements OnInit {
  partnerId!: number;
  partner!: Partner;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.partnerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.partnerId) {
      this.loadPartner(this.partnerId);
    } else {
      this.errorMessage = "ID partenaire invalide.";
    }
  }

  loadPartner(id: number) {
    this.partnerService.getPartnerById(id).subscribe({
      next: (data) => {
        this.partner = data;
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement du partenaire.";
        console.error(err);
      }
    });
  }

  updatePartner() {
    if (!this.partner.nom || !this.partner.logo) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.partnerService.updatePartner(this.partnerId, this.partner).subscribe({
      next: () => {
        this.successMessage = "Partenaire mis à jour avec succès !";
        this.errorMessage = '';
        // Redirection vers la liste après un court délai
        setTimeout(() => {
          this.router.navigate(['/partners']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de la mise à jour du partenaire.";
        this.successMessage = '';
        console.error(err);
      }
    });
  }

  goBackToList() {
    this.router.navigate(['/partners']);
  }
}
