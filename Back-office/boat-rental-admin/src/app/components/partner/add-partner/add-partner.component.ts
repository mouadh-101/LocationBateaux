import { Component } from '@angular/core';
import { PartnerService } from '../../../services/partner.service';
import { Partner } from '../../../interfaces/Partner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})
export class AddPartnerComponent {
  partner: Partner = {
    nom: '',
    logo: ''
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private partnerService: PartnerService, private router: Router) {}

  savePartner() {
    if (!this.partner.nom || !this.partner.logo) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.successMessage = '';
      return;
    }
    this.partnerService.addPartner(this.partner).subscribe({
      next: data => {
        this.successMessage = 'Partenaire ajouté avec succès !';
        this.errorMessage = '';
        // Après un court délai, retourner à la liste
        setTimeout(() => {
          this.router.navigate(['/partners']);
        }, 1500);
      },
      error: err => {
        this.errorMessage = 'Erreur lors de l\'ajout du partenaire';
        this.successMessage = '';
      }
    });
  }

  goBackToList() {
    this.router.navigate(['/partners']);
  }
}
