import { TestBed } from '@angular/core/testing';

import { ProcessedOrderService } from './processed-order.service';

describe('ProcessedOrderService', () => {
  let service: ProcessedOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessedOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
