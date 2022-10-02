import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostImageCommentReplyComponent } from './post-image-comment-reply.component';

describe('PostImageCommentReplyComponent', () => {
  let component: PostImageCommentReplyComponent;
  let fixture: ComponentFixture<PostImageCommentReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostImageCommentReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostImageCommentReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
