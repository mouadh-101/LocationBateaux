import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBoatsComponent } from './delete-boats.component';

describe('DeleteBoatsComponent', () => {
  let component: DeleteBoatsComponent;
  let fixture: ComponentFixture<DeleteBoatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteBoatsComponent]
    });
    fixture = TestBed.createComponent(DeleteBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
