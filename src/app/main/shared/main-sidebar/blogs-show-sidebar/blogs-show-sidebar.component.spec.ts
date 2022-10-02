import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsShowSidebarComponent } from './blogs-show-sidebar.component';

describe('BlogsShowSidebarComponent', () => {
  let component: BlogsShowSidebarComponent;
  let fixture: ComponentFixture<BlogsShowSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsShowSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsShowSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
