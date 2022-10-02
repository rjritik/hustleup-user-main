import { TestBed } from '@angular/core/testing';

import { SelectAddressService } from './select-address.service';

describe('SelectAddressService', () => {
  let service: SelectAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
