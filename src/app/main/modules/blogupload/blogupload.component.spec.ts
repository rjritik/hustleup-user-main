import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloguploadComponent } from './blogupload.component';

describe('BloguploadComponent', () => {
  let component: BloguploadComponent;
  let fixture: ComponentFixture<BloguploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloguploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloguploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
