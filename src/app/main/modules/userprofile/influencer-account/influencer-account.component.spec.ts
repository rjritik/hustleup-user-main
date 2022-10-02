import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerAccountComponent } from './influencer-account.component';

describe('InfluencerAccountComponent', () => {
  let component: InfluencerAccountComponent;
  let fixture: ComponentFixture<InfluencerAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluencerAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
