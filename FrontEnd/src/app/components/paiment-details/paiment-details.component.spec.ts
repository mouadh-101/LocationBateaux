import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaimentDetailsComponent } from './paiment-details.component';

describe('PaimentDetailsComponent', () => {
  let component: PaimentDetailsComponent;
  let fixture: ComponentFixture<PaimentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaimentDetailsComponent]
    });
    fixture = TestBed.createComponent(PaimentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
