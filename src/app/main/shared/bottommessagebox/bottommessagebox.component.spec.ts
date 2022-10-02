import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottommessageboxComponent } from './bottommessagebox.component';

describe('BottommessageboxComponent', () => {
  let component: BottommessageboxComponent;
  let fixture: ComponentFixture<BottommessageboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottommessageboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottommessageboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
