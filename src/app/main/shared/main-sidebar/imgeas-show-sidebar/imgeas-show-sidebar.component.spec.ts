import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgeasShowSidebarComponent } from './imgeas-show-sidebar.component';

describe('ImgeasShowSidebarComponent', () => {
  let component: ImgeasShowSidebarComponent;
  let fixture: ComponentFixture<ImgeasShowSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgeasShowSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgeasShowSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
