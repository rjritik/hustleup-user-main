import { TestBed } from '@angular/core/testing';

import { PromotepostSidebarService } from './promotepost-sidebar.service';

describe('PromotepostSidebarService', () => {
  let service: PromotepostSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotepostSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
