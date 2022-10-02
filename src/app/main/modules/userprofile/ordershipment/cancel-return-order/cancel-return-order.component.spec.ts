import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReturnOrderComponent } from './cancel-return-order.component';

describe('CancelReturnOrderComponent', () => {
  let component: CancelReturnOrderComponent;
  let fixture: ComponentFixture<CancelReturnOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelReturnOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelReturnOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
