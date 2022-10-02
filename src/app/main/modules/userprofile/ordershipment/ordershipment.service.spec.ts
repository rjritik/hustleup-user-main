import { TestBed } from '@angular/core/testing';

import { OrdershipmentService } from './ordershipment.service';

describe('OrdershipmentService', () => {
  let service: OrdershipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdershipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
