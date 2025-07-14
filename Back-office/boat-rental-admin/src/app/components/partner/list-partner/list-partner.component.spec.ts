import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartnersComponent } from './list-partner.component';

describe('ListPartnerComponent', () => {
  let component: ListPartnersComponent;
  let fixture: ComponentFixture<ListPartnersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPartnersComponent]
    });
    fixture = TestBed.createComponent(ListPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
