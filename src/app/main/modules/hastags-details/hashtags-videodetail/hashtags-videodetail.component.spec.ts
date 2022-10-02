import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagsVideodetailComponent } from './hashtags-videodetail.component';

describe('HashtagsVideodetailComponent', () => {
  let component: HashtagsVideodetailComponent;
  let fixture: ComponentFixture<HashtagsVideodetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtagsVideodetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagsVideodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
