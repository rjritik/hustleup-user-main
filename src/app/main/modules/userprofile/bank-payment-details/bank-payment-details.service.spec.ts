import { TestBed } from '@angular/core/testing';

import { BankPaymentDetailsService } from './bank-payment-details.service';

describe('BankPaymentDetailsService', () => {
  let service: BankPaymentDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankPaymentDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
