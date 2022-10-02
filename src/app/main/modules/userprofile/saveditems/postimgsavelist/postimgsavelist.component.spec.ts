import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostimgsavelistComponent } from './postimgsavelist.component';

describe('PostimgsavelistComponent', () => {
  let component: PostimgsavelistComponent;
  let fixture: ComponentFixture<PostimgsavelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostimgsavelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostimgsavelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
