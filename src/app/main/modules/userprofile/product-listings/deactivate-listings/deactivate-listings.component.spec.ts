import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateListingsComponent } from './deactivate-listings.component';

describe('DeactivateListingsComponent', () => {
  let component: DeactivateListingsComponent;
  let fixture: ComponentFixture<DeactivateListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeactivateListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
