import { TestBed } from '@angular/core/testing';

import { CreatechannelService } from './createchannel.service';

describe('CreatechannelService', () => {
  let service: CreatechannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatechannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
