import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosShowSidebarComponent } from './videos-show-sidebar.component';

describe('VideosShowSidebarComponent', () => {
  let component: VideosShowSidebarComponent;
  let fixture: ComponentFixture<VideosShowSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosShowSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosShowSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
