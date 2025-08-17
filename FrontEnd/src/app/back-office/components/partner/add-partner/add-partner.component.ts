import { Component } from '@angular/core';
import { PartnerService } from 'src/app/services/partner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css']
})
export class AddPartnerComponent {
  partnerName: string = '';
  selectedFile: File | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private partnerService: PartnerService, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  savePartner() {
    if (!this.partnerName || !this.selectedFile) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.successMessage = '';
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.partnerName);
    formData.append('logoFile', this.selectedFile);

    this.partnerService.addPartner(formData).subscribe({
      next: () => {
        this.successMessage = 'Partenaire ajouté avec succès !';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/admin/partners']), 1500);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout du partenaire';
        this.successMessage = '';
        console.error(err);
      }
    });
  }
  goBackToList() {
  this.router.navigate(['/admin/partners']); // adapte la route selon ta config Angular
}
}
