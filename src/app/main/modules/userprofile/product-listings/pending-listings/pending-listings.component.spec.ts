import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingListingsComponent } from './pending-listings.component';

describe('PendingListingsComponent', () => {
  let component: PendingListingsComponent;
  let fixture: ComponentFixture<PendingListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
