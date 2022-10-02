import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourStoremapComponent } from './your-storemap.component';

describe('YourStoremapComponent', () => {
  let component: YourStoremapComponent;
  let fixture: ComponentFixture<YourStoremapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourStoremapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourStoremapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
