import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPickupComponent } from './request-pickup.component';

describe('RequestPickupComponent', () => {
  let component: RequestPickupComponent;
  let fixture: ComponentFixture<RequestPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPickupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
