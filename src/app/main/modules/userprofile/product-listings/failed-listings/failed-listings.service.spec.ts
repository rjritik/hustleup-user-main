import { TestBed } from '@angular/core/testing';

import { FailedListingsService } from './failed-listings.service';

describe('FailedListingsService', () => {
  let service: FailedListingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailedListingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
