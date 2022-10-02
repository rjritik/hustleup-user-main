import { TestBed } from '@angular/core/testing';

import { HashtagsDetailsService } from './hashtags-details.service';

describe('HashtagsDetailsService', () => {
  let service: HashtagsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashtagsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
