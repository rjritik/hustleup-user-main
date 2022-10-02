import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagsProductdetailsComponent } from './hashtags-productdetails.component';

describe('HashtagsProductdetailsComponent', () => {
  let component: HashtagsProductdetailsComponent;
  let fixture: ComponentFixture<HashtagsProductdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtagsProductdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagsProductdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
