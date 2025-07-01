import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBoatsComponent } from './edit-boats.component';

describe('EditBoatsComponent', () => {
  let component: EditBoatsComponent;
  let fixture: ComponentFixture<EditBoatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBoatsComponent]
    });
    fixture = TestBed.createComponent(EditBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
