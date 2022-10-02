import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourchannelComponent } from './yourchannel.component';

describe('YourchannelComponent', () => {
  let component: YourchannelComponent;
  let fixture: ComponentFixture<YourchannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourchannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourchannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
