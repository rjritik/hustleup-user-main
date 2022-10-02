import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosProductComponent } from './videos-product.component';

describe('VideosProductComponent', () => {
  let component: VideosProductComponent;
  let fixture: ComponentFixture<VideosProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
