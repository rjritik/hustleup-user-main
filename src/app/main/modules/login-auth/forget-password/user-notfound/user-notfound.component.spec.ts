import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotfoundComponent } from './user-notfound.component';

describe('UserNotfoundComponent', () => {
  let component: UserNotfoundComponent;
  let fixture: ComponentFixture<UserNotfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNotfoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
