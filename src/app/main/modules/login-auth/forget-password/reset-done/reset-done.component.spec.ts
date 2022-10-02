import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetDoneComponent } from './reset-done.component';

describe('ResetDoneComponent', () => {
  let component: ResetDoneComponent;
  let fixture: ComponentFixture<ResetDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetDoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
