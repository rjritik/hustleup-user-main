import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMessageReplyComponent } from './channel-message-reply.component';

describe('ChannelMessageReplyComponent', () => {
  let component: ChannelMessageReplyComponent;
  let fixture: ComponentFixture<ChannelMessageReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelMessageReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelMessageReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
