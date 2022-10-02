import { TestBed } from '@angular/core/testing';

import { ReportEarningService } from './report-earning.service';

describe('ReportEarningService', () => {
  let service: ReportEarningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportEarningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
