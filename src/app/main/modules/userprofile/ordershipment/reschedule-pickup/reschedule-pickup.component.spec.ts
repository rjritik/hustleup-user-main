import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReschedulePickupComponent } from './reschedule-pickup.component';

describe('ReschedulePickupComponent', () => {
  let component: ReschedulePickupComponent;
  let fixture: ComponentFixture<ReschedulePickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReschedulePickupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReschedulePickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
