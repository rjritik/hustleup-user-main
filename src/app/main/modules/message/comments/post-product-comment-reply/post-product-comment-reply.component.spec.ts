import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProductCommentReplyComponent } from './post-product-comment-reply.component';

describe('PostProductCommentReplyComponent', () => {
  let component: PostProductCommentReplyComponent;
  let fixture: ComponentFixture<PostProductCommentReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostProductCommentReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProductCommentReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
