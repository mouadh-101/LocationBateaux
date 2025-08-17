import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent {
  @Input() images: { url: string }[] = [];
  @Input() boatName: string = '';

  currentIndex = 0;
  autoScrollInterval: any;
  isAutoScrollPaused = false;

  ngOnInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isAutoScrollPaused && this.images.length > 1) {
        this.nextImage();
      }
    }, 4000);
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  pauseAutoScroll() {
    this.isAutoScrollPaused = true;
  }

  resumeAutoScroll() {
    this.isAutoScrollPaused = false;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousImage() {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }

  trackByIndex(index: number): number {
    return index;
  }

}
