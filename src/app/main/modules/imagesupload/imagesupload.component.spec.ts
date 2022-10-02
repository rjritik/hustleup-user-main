import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesuploadComponent } from './imagesupload.component';

describe('ImagesuploadComponent', () => {
  let component: ImagesuploadComponent;
  let fixture: ComponentFixture<ImagesuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesuploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
