import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBoatsAdminComponent } from './details-boats-admin.component';

describe('DetailsBoatsAdminComponent', () => {
  let component: DetailsBoatsAdminComponent;
  let fixture: ComponentFixture<DetailsBoatsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsBoatsAdminComponent]
    });
    fixture = TestBed.createComponent(DetailsBoatsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
