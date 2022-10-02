import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProductCommentComponent } from './post-product-comment.component';

describe('PostProductCommentComponent', () => {
  let component: PostProductCommentComponent;
  let fixture: ComponentFixture<PostProductCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostProductCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProductCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
