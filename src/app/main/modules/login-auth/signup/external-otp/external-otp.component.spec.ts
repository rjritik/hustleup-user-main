import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalOtpComponent } from './external-otp.component';

describe('ExternalOtpComponent', () => {
  let component: ExternalOtpComponent;
  let fixture: ComponentFixture<ExternalOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
