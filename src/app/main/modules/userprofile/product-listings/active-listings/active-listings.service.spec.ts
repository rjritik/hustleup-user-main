import { TestBed } from '@angular/core/testing';

import { ActiveListingsService } from './active-listings.service';

describe('ActiveListingsService', () => {
  let service: ActiveListingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveListingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
