import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsavelistComponent } from './blogsavelist.component';

describe('BlogsavelistComponent', () => {
  let component: BlogsavelistComponent;
  let fixture: ComponentFixture<BlogsavelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsavelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsavelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
