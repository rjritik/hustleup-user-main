import { TestBed } from '@angular/core/testing';

import { YourchannelService } from './yourchannel.service';

describe('YourchannelService', () => {
  let service: YourchannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YourchannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
