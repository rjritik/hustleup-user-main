import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagsBlogsdetailComponent } from './hashtags-blogsdetail.component';

describe('HashtagsBlogsdetailComponent', () => {
  let component: HashtagsBlogsdetailComponent;
  let fixture: ComponentFixture<HashtagsBlogsdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtagsBlogsdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagsBlogsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
