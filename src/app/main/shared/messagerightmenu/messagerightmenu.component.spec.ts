import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerightmenuComponent } from './messagerightmenu.component';

describe('MessagerightmenuComponent', () => {
  let component: MessagerightmenuComponent;
  let fixture: ComponentFixture<MessagerightmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagerightmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerightmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
