import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPaymentDetailsComponent } from './bank-payment-details.component';

describe('BankPaymentDetailsComponent', () => {
  let component: BankPaymentDetailsComponent;
  let fixture: ComponentFixture<BankPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankPaymentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
