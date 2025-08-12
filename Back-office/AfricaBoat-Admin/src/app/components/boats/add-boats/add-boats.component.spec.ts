import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoatComponent } from './add-boats.component';

describe('AddBoatsComponent', () => {
  let component: AddBoatComponent;
  let fixture: ComponentFixture<AddBoatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBoatComponent]
    });
    fixture = TestBed.createComponent(AddBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
