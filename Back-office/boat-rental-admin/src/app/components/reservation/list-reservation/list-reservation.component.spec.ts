import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsListComponent } from './list-reservation.component';

describe('ListReservationComponent', () => {
  let component: ReservationsListComponent;
  let fixture: ComponentFixture<ReservationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationsListComponent]
    });
    fixture = TestBed.createComponent(ReservationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
