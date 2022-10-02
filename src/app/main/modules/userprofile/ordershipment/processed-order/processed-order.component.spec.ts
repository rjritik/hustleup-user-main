import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedOrderComponent } from './processed-order.component';

describe('ProcessedOrderComponent', () => {
  let component: ProcessedOrderComponent;
  let fixture: ComponentFixture<ProcessedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessedOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
