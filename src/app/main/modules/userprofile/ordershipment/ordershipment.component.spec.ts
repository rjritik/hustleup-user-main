import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdershipmentComponent } from './ordershipment.component';

describe('OrdershipmentComponent', () => {
  let component: OrdershipmentComponent;
  let fixture: ComponentFixture<OrdershipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdershipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdershipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
