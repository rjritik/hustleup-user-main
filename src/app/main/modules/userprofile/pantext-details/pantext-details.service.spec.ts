import { TestBed } from '@angular/core/testing';

import { PantextDetailsService } from './pantext-details.service';

describe('PantextDetailsService', () => {
  let service: PantextDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantextDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
