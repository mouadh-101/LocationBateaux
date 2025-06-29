import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedBoatComponent } from './featured-boat.component';

describe('FeaturedBoatComponent', () => {
  let component: FeaturedBoatComponent;
  let fixture: ComponentFixture<FeaturedBoatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeaturedBoatComponent]
    });
    fixture = TestBed.createComponent(FeaturedBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
