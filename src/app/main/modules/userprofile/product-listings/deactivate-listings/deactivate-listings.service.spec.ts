import { TestBed } from '@angular/core/testing';

import { DeactivateListingsService } from './deactivate-listings.service';

describe('DeactivateListingsService', () => {
  let service: DeactivateListingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeactivateListingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
