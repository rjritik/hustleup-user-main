import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPromocodeComponent } from './offer-promocode.component';

describe('OfferPromocodeComponent', () => {
  let component: OfferPromocodeComponent;
  let fixture: ComponentFixture<OfferPromocodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferPromocodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferPromocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
