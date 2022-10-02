import { TestBed } from '@angular/core/testing';

import { RightsidebarService } from './rightsidebar.service';

describe('RightsidebarService', () => {
  let service: RightsidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RightsidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
