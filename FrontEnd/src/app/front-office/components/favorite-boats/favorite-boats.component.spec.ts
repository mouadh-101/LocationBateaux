import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBoatsComponent } from './favorite-boats.component';

describe('FavoriteBoatsComponent', () => {
  let component: FavoriteBoatsComponent;
  let fixture: ComponentFixture<FavoriteBoatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteBoatsComponent]
    });
    fixture = TestBed.createComponent(FavoriteBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
