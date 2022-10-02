import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBlogCommentReplyComponent } from './post-blog-comment-reply.component';

describe('PostBlogCommentReplyComponent', () => {
  let component: PostBlogCommentReplyComponent;
  let fixture: ComponentFixture<PostBlogCommentReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostBlogCommentReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostBlogCommentReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
