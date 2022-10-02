import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostImageCommentComponent } from './post-image-comment.component';

describe('PostImageCommentComponent', () => {
  let component: PostImageCommentComponent;
  let fixture: ComponentFixture<PostImageCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostImageCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostImageCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
