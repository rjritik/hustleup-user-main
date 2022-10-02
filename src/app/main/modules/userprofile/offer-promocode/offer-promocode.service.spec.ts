import { TestBed } from '@angular/core/testing';

import { OfferPromocodeService } from './offer-promocode.service';

describe('OfferPromocodeService', () => {
  let service: OfferPromocodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferPromocodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
