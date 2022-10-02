import { TestBed } from '@angular/core/testing';

import { MinimizepopService } from './minimizepop.service';

describe('MinimizepopService', () => {
  let service: MinimizepopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinimizepopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
