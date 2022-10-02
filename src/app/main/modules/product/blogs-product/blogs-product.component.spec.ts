import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsProductComponent } from './blogs-product.component';

describe('BlogsProductComponent', () => {
  let component: BlogsProductComponent;
  let fixture: ComponentFixture<BlogsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
