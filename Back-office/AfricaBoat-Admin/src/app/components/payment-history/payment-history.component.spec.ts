import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePaiementComponent } from './payment-history.component';

describe('HistoriquePaiementComponent', () => {
  let component: HistoriquePaiementComponent;
  let fixture: ComponentFixture<HistoriquePaiementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriquePaiementComponent]
    });
    fixture = TestBed.createComponent(HistoriquePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
