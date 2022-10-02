import { TestBed } from '@angular/core/testing';

import { PendingListingsService } from './pending-listings.service';

describe('PendingListingsService', () => {
  let service: PendingListingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingListingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
