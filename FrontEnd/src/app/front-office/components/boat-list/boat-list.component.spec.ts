import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatListComponent } from './boat-list.component';

describe('BoatListComponent', () => {
  let component: BoatListComponent;
  let fixture: ComponentFixture<BoatListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoatListComponent]
    });
    fixture = TestBed.createComponent(BoatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
