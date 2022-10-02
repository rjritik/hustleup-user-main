import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosavelistComponent } from './videosavelist.component';

describe('VideosavelistComponent', () => {
  let component: VideosavelistComponent;
  let fixture: ComponentFixture<VideosavelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosavelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosavelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
