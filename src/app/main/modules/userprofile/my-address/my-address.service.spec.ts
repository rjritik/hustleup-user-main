import { TestBed } from '@angular/core/testing';

import { MyAddressService } from './my-address.service';

describe('MyAddressService', () => {
  let service: MyAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
