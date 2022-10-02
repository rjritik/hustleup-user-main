import { TestBed } from '@angular/core/testing';

import { ProductTypeSearchService } from './product-type-search.service';

describe('ProductTypeSearchService', () => {
  let service: ProductTypeSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTypeSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
