import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutLoginComponent } from './without-login.component';

describe('WithoutLoginComponent', () => {
  let component: WithoutLoginComponent;
  let fixture: ComponentFixture<WithoutLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithoutLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithoutLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
