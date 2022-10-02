import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicchannelComponent } from './publicchannel.component';

describe('PublicchannelComponent', () => {
  let component: PublicchannelComponent;
  let fixture: ComponentFixture<PublicchannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicchannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicchannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
