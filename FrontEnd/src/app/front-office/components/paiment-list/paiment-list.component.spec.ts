import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaimentListComponent } from './paiment-list.component';

describe('PaimentListComponent', () => {
  let component: PaimentListComponent;
  let fixture: ComponentFixture<PaimentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaimentListComponent]
    });
    fixture = TestBed.createComponent(PaimentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
