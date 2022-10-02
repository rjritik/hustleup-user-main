import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVideoCommentComponent } from './post-video-comment.component';

describe('PostVideoCommentComponent', () => {
  let component: PostVideoCommentComponent;
  let fixture: ComponentFixture<PostVideoCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostVideoCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostVideoCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
