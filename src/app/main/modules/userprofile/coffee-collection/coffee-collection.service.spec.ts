import { TestBed } from '@angular/core/testing';

import { CoffeeCollectionService } from './coffee-collection.service';

describe('CoffeeCollectionService', () => {
  let service: CoffeeCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoffeeCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
