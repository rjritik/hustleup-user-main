import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUpdatesComponent } from './channel-updates.component';

describe('ChannelUpdatesComponent', () => {
  let component: ChannelUpdatesComponent;
  let fixture: ComponentFixture<ChannelUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelUpdatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
