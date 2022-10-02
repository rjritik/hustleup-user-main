import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandApprovalComponent } from './brand-approval.component';

describe('BrandApprovalComponent', () => {
  let component: BrandApprovalComponent;
  let fixture: ComponentFixture<BrandApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
