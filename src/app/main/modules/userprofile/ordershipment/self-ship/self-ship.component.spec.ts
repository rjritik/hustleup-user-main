import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfShipComponent } from './self-ship.component';

describe('SelfShipComponent', () => {
  let component: SelfShipComponent;
  let fixture: ComponentFixture<SelfShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfShipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
