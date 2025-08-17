import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatCalendarComponent } from './boat-calendar.component';

describe('BoatCalendarComponent', () => {
  let component: BoatCalendarComponent;
  let fixture: ComponentFixture<BoatCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoatCalendarComponent]
    });
    fixture = TestBed.createComponent(BoatCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
