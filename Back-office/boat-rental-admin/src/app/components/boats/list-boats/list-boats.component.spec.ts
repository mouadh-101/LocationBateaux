import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBoatsComponent } from './list-boats.component';

describe('ListBoatsComponent', () => {
  let component: ListBoatsComponent;
  let fixture: ComponentFixture<ListBoatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBoatsComponent]
    });
    fixture = TestBed.createComponent(ListBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
