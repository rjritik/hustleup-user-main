import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfDropComponent } from './self-drop.component';

describe('SelfDropComponent', () => {
  let component: SelfDropComponent;
  let fixture: ComponentFixture<SelfDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
