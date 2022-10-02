import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedOrderComponent } from './dispatched-order.component';

describe('DispatchedOrderComponent', () => {
  let component: DispatchedOrderComponent;
  let fixture: ComponentFixture<DispatchedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchedOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
