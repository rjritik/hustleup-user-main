import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVideoCommentReplyComponent } from './post-video-comment-reply.component';

describe('PostVideoCommentReplyComponent', () => {
  let component: PostVideoCommentReplyComponent;
  let fixture: ComponentFixture<PostVideoCommentReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostVideoCommentReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostVideoCommentReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
