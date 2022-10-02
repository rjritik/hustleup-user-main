import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsProfileComponent } from './blogs-profile.component';

describe('BlogsProfileComponent', () => {
  let component: BlogsProfileComponent;
  let fixture: ComponentFixture<BlogsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
