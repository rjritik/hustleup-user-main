import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDiscussionsComponent } from './channel-discussions.component';

describe('ChannelDiscussionsComponent', () => {
  let component: ChannelDiscussionsComponent;
  let fixture: ComponentFixture<ChannelDiscussionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelDiscussionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelDiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
