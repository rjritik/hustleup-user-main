import { TestBed } from '@angular/core/testing';

import { MutedAccountsService } from './muted-accounts.service';

describe('MutedAccountsService', () => {
  let service: MutedAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MutedAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
