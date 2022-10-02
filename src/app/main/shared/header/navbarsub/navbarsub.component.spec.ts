import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsubComponent } from './navbarsub.component';

describe('NavbarsubComponent', () => {
  let component: NavbarsubComponent;
  let fixture: ComponentFixture<NavbarsubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarsubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarsubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
