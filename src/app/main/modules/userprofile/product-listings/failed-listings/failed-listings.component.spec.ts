import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedListingsComponent } from './failed-listings.component';

describe('FailedListingsComponent', () => {
  let component: FailedListingsComponent;
  let fixture: ComponentFixture<FailedListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
