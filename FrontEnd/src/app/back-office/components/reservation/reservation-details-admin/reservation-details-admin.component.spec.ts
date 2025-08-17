import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDetailsAdminComponent } from './reservation-details-admin.component';

describe('ReservationDetailsAdminComponent', () => {
  let component: ReservationDetailsAdminComponent;
  let fixture: ComponentFixture<ReservationDetailsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationDetailsAdminComponent]
    });
    fixture = TestBed.createComponent(ReservationDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
