import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagsPostdetailComponent } from './hashtags-postdetail.component';

describe('HashtagsPostdetailComponent', () => {
  let component: HashtagsPostdetailComponent;
  let fixture: ComponentFixture<HashtagsPostdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtagsPostdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagsPostdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
