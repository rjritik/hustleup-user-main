import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEarningComponent } from './report-earning.component';

describe('ReportEarningComponent', () => {
  let component: ReportEarningComponent;
  let fixture: ComponentFixture<ReportEarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportEarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
