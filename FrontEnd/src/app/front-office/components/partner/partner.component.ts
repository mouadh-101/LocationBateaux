import {AfterViewInit, Component, ElementRef, ViewChild,OnDestroy } from '@angular/core';
import { Partner } from 'src/app/interfaces/partner';
import { PartnerService } from 'src/app/services/partner.service';


@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent {
  partners: Partner[] = [];
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef<HTMLDivElement>;

  private animationFrameId: number | null = null;
  private scrollSpeed = 0.5; // pixels per frame
  private scrollPos = 0;

  ngAfterViewInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    const container = this.scrollContainer.nativeElement;
  
    const step = () => {
      this.scrollPos += this.scrollSpeed;
      if (this.scrollPos >= container.scrollWidth / 2) {
        this.scrollPos = 0; // Seamless loop back to start
      }
      container.scrollLeft = this.scrollPos;
      this.animationFrameId = requestAnimationFrame(step);
    };
  
    this.animationFrameId = requestAnimationFrame(step);
  }

  stopAutoScroll() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  constructor(private partnerService:PartnerService) {}

  ngOnInit() {
    this.partnerService.getPartners().subscribe((partners)=>{
      this.partners=partners;
    });
  }

  trackByPartnerId(index: number, partner: Partner): number {
    return partner.partnerId;
  }

}
