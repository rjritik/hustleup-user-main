import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBlogCommentComponent } from './post-blog-comment.component';

describe('PostBlogCommentComponent', () => {
  let component: PostBlogCommentComponent;
  let fixture: ComponentFixture<PostBlogCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostBlogCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostBlogCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
