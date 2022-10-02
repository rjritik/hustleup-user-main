import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizzlesComponent } from './sizzles.component';

describe('SizzlesComponent', () => {
  let component: SizzlesComponent;
  let fixture: ComponentFixture<SizzlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SizzlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SizzlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
