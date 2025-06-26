import { Component, Input } from '@angular/core';
import { Avis } from 'src/app/interfaces/boat';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @Input() avis: Avis[] = [];

  showAllReviews = false;

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
    return avis.AvisId;
  }

}
