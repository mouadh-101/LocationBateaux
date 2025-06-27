import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Avis } from 'src/app/interfaces/boat';
import { AuthService } from 'src/app/services/auth.service';
import { AvisService } from 'src/app/services/avis.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @Input() avis: Avis[] = [];
  avisForm: FormGroup;
  boatId: number | null = null;
  editingAvisId: number | null = null;
  hoverRating = 0;
  isLoggedIn: boolean = false;
  showAllReviews = false;
  currentUserId: number | null = null;
  isEditing: boolean = false;

  constructor(private authService: AuthService, private avisService: AvisService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.avisForm = this.fb.group({
      note: [0, Validators.required],
      commentaire: ['', Validators.required]
    });
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.boatId = +params['id'];
    });
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUserId = this.authService.decodeIdFromToken();
    console.log('Avis example:', this.avis[0]);
  }
  editAvis(avis: any) {
    this.isEditing = true;
    this.editingAvisId = avis.avisId;
    this.avisForm.patchValue({
      note: avis.note,
      commentaire: avis.commentaire
    });

  }

  deleteAvis(avisId: number) {
    console.log('avisId:', avisId);
    if (!avisId) {
      alert("ID invalide.");
      return;
    }

    this.avisService.deleteAvis(avisId).subscribe({
      next: () => {
        this.avis = this.avis.filter(a => a.avisId !== avisId);
      },
      error: err => console.error('Erreur lors de la suppression :', err)
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
    if (this.avisForm.valid) {
      const avis: Avis = this.avisForm.value;
      if (this.boatId === null) {
        alert('Boat ID is missing.');
        return;
      }
      if (this.isEditing && this.editingAvisId !== null) {
        avis.avisId = this.editingAvisId;
        this.avisService.updateAvis(avis).subscribe({
          next: (res) => {
            const index = this.avis.findIndex(a => a.avisId === this.editingAvisId);
            if (index !== -1) {
              this.avis[index] = res;
            }
            this.avisForm.reset({ note: 0, commentaire: '' });
            this.isEditing = false;
            this.editingAvisId = null;
          },
          error: () => alert('Erreur lors de l\'envoi de l\'avis')
        });
      }
      else {
        this.avisService.addAvis(avis, this.boatId).subscribe({
          next: (res) => {
            this.avis.push(res); // update UI
            this.avisForm.reset({ note: 0, commentaire: '' });
          },
          error: () => alert('Erreur lors de l\'envoi de l\'avis')
        });
      }
    }
  }

}
