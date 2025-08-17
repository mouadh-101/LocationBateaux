import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from 'src/app/services/partner.service';
import { Partner } from 'src/app/interfaces/partner';

@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.css']
})
export class EditPartnerComponent implements OnInit {
  partnerId!: number;
  partner!: Partner;
  selectedFile: File | null = null;

  logoSuppressed = false;
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
      error: () => {
        this.errorMessage = "Erreur lors du chargement du partenaire.";
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  removeLogo() {
    this.logoSuppressed = true;
    this.partner.logo = '';
  }

  updatePartner() {
    if (!this.partner.nom) {
      this.errorMessage = 'Veuillez remplir le nom';
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.partner.nom);

    if (this.selectedFile) {
      formData.append('logoFile', this.selectedFile);
    } else if (this.logoSuppressed) {
      formData.append('logoFile', ''); // signal de suppression côté backend
    }

    this.partnerService.updatePartner(this.partnerId, formData).subscribe({
      next: () => {
        this.successMessage = "Partenaire mis à jour avec succès !";
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/admin/partners']), 1500);
      },
      error: () => {
        this.errorMessage = "Erreur lors de la mise à jour.";
        this.successMessage = '';
      }
    });
  }

  goBackToList() {
    this.router.navigate(['/admin/partners']);
  }
}
