import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoProfileComponent } from './video-profile.component';

describe('VideoProfileComponent', () => {
  let component: VideoProfileComponent;
  let fixture: ComponentFixture<VideoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
