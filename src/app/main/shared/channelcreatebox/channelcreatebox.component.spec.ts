import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelcreateboxComponent } from './channelcreatebox.component';

describe('ChannelcreateboxComponent', () => {
  let component: ChannelcreateboxComponent;
  let fixture: ComponentFixture<ChannelcreateboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelcreateboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelcreateboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
