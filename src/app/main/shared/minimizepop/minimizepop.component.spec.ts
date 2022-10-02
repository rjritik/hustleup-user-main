import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimizepopComponent } from './minimizepop.component';

describe('MinimizepopComponent', () => {
  let component: MinimizepopComponent;
  let fixture: ComponentFixture<MinimizepopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinimizepopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimizepopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
