import { TestBed } from '@angular/core/testing';

import { MessagechatService } from './messagechat.service';

describe('MessagechatService', () => {
  let service: MessagechatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagechatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
