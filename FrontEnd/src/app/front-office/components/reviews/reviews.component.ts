import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { A } from '@fullcalendar/core/internal-common';
import { Avis } from 'src/app/interfaces/boat';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { AvisService } from 'src/app/services/avis.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  avisForm: FormGroup;
  boatId: number | null = null;
  editingAvisId: number | null = null;
  hoverRating = 0;
  isLoggedIn: boolean = false;
  showAllReviews = false;
  currentUserId: number | null = null;
  isEditing: boolean = false;
  avis: Avis[] = [];

  constructor(private authService: AuthService, private avisService: AvisService, private fb: FormBuilder, private route: ActivatedRoute, private alertService: AlertService) {
    this.avisForm = this.fb.group({
      note: [0, Validators.required],
      commentaire: ['', Validators.required]
    });

  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.boatId = +params['id'];
      this.avisService.getAvisByBoatId(this.boatId).subscribe({
        next: (avis) => {
          this.avis = avis;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des avis:', err);
          this.alertService.showAlert('Erreur lors de la récupération des avis.', 'error');
        }
      });
    });
      this.isLoggedIn = this.authService.isLoggedIn();
      this.currentUserId = this.authService.decodeIdFromToken();
    }
  editAvis(avis:Avis) {
      this.isEditing = true;
      this.editingAvisId = avis.avisId;
      this.avisForm.patchValue({
        note: avis.note,
        commentaire: avis.commentaire
      });

    }

  deleteAvis(avisId: number) {
      console.log('avisId:', avisId);
      if(!avisId) {
        alert("ID invalide.");
        return;
      }

    this.avisService.deleteAvis(avisId).subscribe({
        next: () => {
          this.avis = this.avis.filter(a => a.avisId !== avisId);
          this.alertService.showAlert('Avis supprimé avec succès.', 'success');
        },
        error: err => this.alertService.showAlert('Erreur lors de la suppression de l\'avis.', 'error')
      });
    }





  get displayedReviews(): Avis[] {
      return this.showAllReviews ? this.avis : this.avis.slice(0, 3);
    }

  toggleShowAllReviews() {
      this.showAllReviews = !this.showAllReviews;
    }

  getRatingDistribution(): { rating: number; count: number; percentage: number }[] {
      const distribution = [5, 4, 3, 2, 1].map(rating => {
        const count = this.avis.filter(avis => avis.note === rating).length;
        const percentage = this.avis.length > 0 ? (count / this.avis.length) * 100 : 0;
        return { rating, count, percentage };
      });
      return distribution;
    }

  formatDate(date: Date): string {
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    }

  trackByAvisId(index: number, avis: Avis): number {
      return avis.avisId;
    }

  setRating(star: number) {
      this.avisForm.patchValue({ note: star });
    }

  submitAvis() {
      if(this.avisForm.valid) {
      const avis: Avis = this.avisForm.value;
      if (this.boatId === null) {
        alert('Boat ID is missing.');
        return;
      }
      if (this.isEditing && this.editingAvisId !== null) {
        avis.avisId = this.editingAvisId;
        this.avisService.updateAvis(avis).subscribe({
          next: (res) => {
            this.alertService.showAlert('Avis mis à jour avec succès.', 'success');
            const index = this.avis.findIndex(a => a.avisId === this.editingAvisId);
            if (index !== -1) {
              this.avis[index] = res;
            }
            this.avisForm.reset({ note: 0, commentaire: '' });
            this.isEditing = false;
            this.editingAvisId = null;
          },
          error: () => this.alertService.showAlert('Erreur lors de la mise à jour de l\'avis', 'error')
        });
      }
      else {
        this.avisService.addAvis(avis, this.boatId).subscribe({
          next: (res) => {
            this.alertService.showAlert('Avis ajouté avec succès.', 'success');
            this.avis.push(res); // update UI
            this.avisForm.reset({ note: 0, commentaire: '' });
          },
          error: () => this.alertService.showAlert('Erreur lors de l\'ajout de l\'avis', 'error')
        });
      }
    }
  }

}
