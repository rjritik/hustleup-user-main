import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantextDetailsComponent } from './pantext-details.component';

describe('PantextDetailsComponent', () => {
  let component: PantextDetailsComponent;
  let fixture: ComponentFixture<PantextDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantextDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PantextDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
