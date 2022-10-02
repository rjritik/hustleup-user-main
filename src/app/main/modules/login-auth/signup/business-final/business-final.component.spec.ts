import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFinalComponent } from './business-final.component';

describe('BusinessFinalComponent', () => {
  let component: BusinessFinalComponent;
  let fixture: ComponentFixture<BusinessFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessFinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
