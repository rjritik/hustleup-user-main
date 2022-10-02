import { TestBed } from '@angular/core/testing';

import { RightmenuService } from './rightmenu.service';

describe('RightmenuService', () => {
  let service: RightmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RightmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
